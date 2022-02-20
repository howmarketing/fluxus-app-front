import BN from 'bn.js';
import {
	ONE_YOCTO_NEAR,
	refFiViewFunction,
	Transaction,
	REF_FI_CONTRACT_ID,
	executeMultipleTransactions,
} from '@services/near';
import { ftGetStorageBalance, TokenMetadata } from '@services/ft-contract';

import { toNonDivisibleNumber } from '@utils/numbers';
import { STORAGE_TO_REGISTER_WITH_FT, storageDepositAction } from '@services/creators/storage';
import { unwrapNear, WRAP_NEAR_CONTRACT_ID } from '@services/wrap-near';
import ProviderPattern from '@services/ProviderPattern';
import { getStakedListByAccountId } from '@services/farm';
import { Near } from 'near-api-js';
import { functionCall } from 'near-api-js/lib/transaction';
import AbstractMainProviderActions from './AbstractMainProviderActions';
import AbstractGenericActions from './AbstractGenericActions';

type IFunctionCall = {
	contractId?: string;
	methodName?: string;
	args?: Record<any, any>;
	gas?: BN;
	amount?: BN;
};

type IBatchTransaction = { receiverId: string; functionsCall: Array<IFunctionCall> };

type IExecBatchTransaction = Array<IBatchTransaction>;

interface WithdrawOptions {
	token: TokenMetadata;
	amount: string;
	unregister?: boolean;
}

export interface TokenBalancesView {
	[tokenId: string]: string;
}

export default class AbstractMainVaultProviderActions extends AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AbstractMainVaultProviderActions;

	protected declare _providerActionsInstace: AbstractMainProviderActions;

	/**
	 * GET THE SINGLETON INSTANCE OF THIS CLASS
	 */
	public static getInstance(providerActionsInstance: AbstractMainProviderActions) {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp(providerActionsInstance);
		return this._classInstanceSingleton;
	}

	/**
	 * GET THE PROVICER ACTIONS INSTACE
	 */
	public getProviderActionsInstace() {
		return this._providerActionsInstace;
	}

	/**
	 * GET THE TOKEN ACTIONS INSTACE
	 */
	protected getTokenActionsInstance() {
		return this.getProviderActionsInstace().getTokenActions();
	}

	/**
	 * GET THE VAULT CONTRACT ID
	 */
	public getVaultContractId() {
		return this.getProviderConfigData().FLUXUS_VAULT_CONTRACT_ID;
	}

	/**
	 * GET THE LIST OF ALL STAKES THE VAULT HAVE SHARES
	 */
	public async getVaultStakedList({ useFluxusFarmContract = true }) {
		const accountId = this.getVaultContractId();
		const parms = {
			accountId,
			useFluxusFarmContract,
		};
		return getStakedListByAccountId(parms);
	}

	/**
	 * GET THE VAULT TOTAL STAKED SHARE
	 */
	public async getVaultStakeValueFromSeed({
		seed_id = 'exchange.ref-dev.testnet@193',
		useFluxusFarmContract = true,
	}): Promise<string | null> {
		const stakedList = await this.getVaultStakedList({ useFluxusFarmContract });
		const seedStakedValue = stakedList[seed_id];
		return typeof seedStakedValue !== 'undefined' ? seedStakedValue : null;
	}

	/**
	 * DEPOSIT TO VAULT (STEP 1/3 FOR AUTO-COMPOUND)
	 * @description Deposit to vault just storage the amount for.
	 * @description After deposit, can be used to wrap that amount
	 * @description When it is wrapped, this amount will be available to add to vault (start auto-compound)
	 */
	public async storageDeposit(amountToDeposit?: string | undefined): Promise<Record<any, any> | undefined> {
		this.devImplementation = true;
		const walletAccountID = this.getWallet().getAccountId();
		const methodName = 'storage_deposit';
		const args = {
			account_id: walletAccountID,
			registration_only: false,
		};
		const amount = new BN(toNonDivisibleNumber(24, amountToDeposit || '2'));
		return this.execVaultContractAsCallFunction<Record<any, any> | any>({ methodName, args, amount });
	}

	/**
	 * WRAP THE STORAGED NEAR DEPOSIT TO WRAP-NEAR (STEP 2/3 FOR AUTO-COMPOUND)
	 * @description After amount has been deposited, this method call to wrap the total user from vault near amount.
	 */
	public async wrapNearBalance(
		account_id = ProviderPattern.getProviderInstance().getWallet().getAccountId(),
	): Promise<Record<any, any> | undefined> {
		this.devImplementation = true;
		const walletAccountID = account_id;
		const refExchangeContractID =
			ProviderPattern.getProviderInstance().getConnectionConfigData().REF_FI_CONTRACT_ID || '';
		const methodName = 'near_to_wrap';
		const args = {
			receiver_id: refExchangeContractID,
			account_id,
			amount: '1000000000000000000000',
			msg: '',
		};
		return this.execVaultContractAsCallFunction<Record<any, any> | any>({ methodName, args });
	}

	public async batchTransactionDepositAndWrapNearBalance({
		account_id = this.getWallet().getAccountId(),
		amountToDeposit = '0',
		exchange_contract_id = this.getProviderConfigData().REF_FI_CONTRACT_ID,
	}): Promise<any> {
		const vaultContractID = this.getVaultContractId();
		const calls: IExecBatchTransaction = [];
		const totalAvailableGas = '300000000000000';
		const wrapNearGas = '260000000000000';
		const depositGas = `${Number(totalAvailableGas) - Number(wrapNearGas)}`;
		const depositingAmount = new BN(toNonDivisibleNumber(24, amountToDeposit || '0'));
		// deposit near
		calls.push({
			receiverId: vaultContractID,
			functionsCall: [
				{
					contractId: vaultContractID,
					methodName: 'storage_deposit',
					args: {
						account_id,
						registration_only: false,
						msg: '',
					},
					gas: new BN(depositGas),
					amount: depositingAmount,
				},
			],
		});

		// wrap near
		calls.push({
			receiverId: vaultContractID,
			functionsCall: [
				{
					contractId: vaultContractID,
					methodName: 'near_to_wrap',
					args: {
						receiver_id: exchange_contract_id,
						account_id,
						amount: '1',
						msg: '',
					},
					gas: new BN(wrapNearGas),
					amount: new BN('0'),
				},
			],
		});
		return this.execBatchTransaction(calls);
	}

	/**
	 * START AUTO-COMPOUND WITH VAULT POWERS (STEP 3/3 FOR AUTO-COMPOUND)
	 * @description The vault contract start all the process to get shares to start to earn.
	 * @description Vault get the swap these user balance of wrapped near to pool token pairs
	 * @description Vault add to pool these token pairs, earning LP that will be staked.
	 * @description Vault stake these LP into farm, incrementing they own shares from farm as user normalized shares from vault total owned shares
	 */
	public async addToVault({ account_id = this.getWallet().getAccountId() }) {
		this.devImplementation = true;
		const vaultContractID = this.getProviderConfigData().FLUXUS_VAULT_CONTRACT_ID;
		const walletAccountID = account_id;
		const gasBN = new BN('300000000000000');
		const amountBN = new BN(0);
		const methodName = 'add_to_vault';
		const args = {
			vault_contract: vaultContractID,
			account_id: walletAccountID,
		};
		const dataArr = { vaultContractID, methodName, args, gasBN, amountBN };
		console.log('dataArr: ', dataArr);
		return this.getProviderActionsInstace()
			.getProviderProtocolInstance()
			.getWallet()
			.account()
			.functionCall(vaultContractID, methodName, args, gasBN, amountBN);
	}

	/**
	 * GET THE USER WRAP-NEAR TOTAL AMOUNT FROM VAULT (Available just after near be wrapped in step 2/3)
	 * @description Deposit to vault just storage the amount for.
	 * @description After deposit, can be used to wrap that amount
	 * @description When it is wrapped, this amount will be available to add to vault (start auto-compound)
	 */
	public async VAULTStorageBalanceOf(): Promise<Record<any, any> | undefined> {
		this.devImplementation = true;
		const walletAccountID = this.getWallet().getAccountId();
		const refExchangeContractID =
			ProviderPattern.getProviderInstance().getConnectionConfigData().REF_FI_CONTRACT_ID || '';
		const methodName = 'storage_balance_of';
		const args = {
			receiver_id: refExchangeContractID,
			account_id: walletAccountID,
			amount: '100000000000000000000000',
			msg: '',
		};
		return this.execVaultContractAsViewFunction<Record<any, any> | any>({ methodName, args });
	}

	/**
	 * STEP 1/3 FOR WITHDRAW -
	 * WITHDRAW USER STAKED LP WITH VAULT FROM REF FARM SMART CONTRACT
	 * @description User have LP staked in farm thought vault smart contract, so this function will withdraw all they staked LP
	 * @description But will not withdraw from pool, so this LP keep available to add again
	 */
	public async withdrawAllUserStakedLP<T extends any>({
		seed_id = 'exchange.ref-dev.testnet@193',
		account_id = this.getWallet().getAccountId(),
	}): Promise<T> {
		const vault_contract = this.getProviderConfigData().FLUXUS_VAULT_CONTRACT_ID;
		const args = {
			seed_id,
			vault_contract,
			account_id,
			msg: '',
		};
		return this.execVaultContractAsCallFunction<T>({ methodName: 'withdraw_all', args });
	}

	/**
	 * STEP 2/3 FOR WITHDRAW -
	 * WITHDRAW ALL USER LIQUIDITY WITH VAULT FROM REF SMART CONTRACT
	 * @description User have liquidity added in pool thought vault smart contract, so this function will withdraw all this liquidity
	 * @description But will not withdraw from vault to user wallet
	 */
	public async withdrawAllUserLiquidityPool<T extends any>({
		account_id = this.getWallet().getAccountId(),
	}): Promise<T> {
		const vault_contract = this.getProviderConfigData().FLUXUS_VAULT_CONTRACT_ID;
		const args = {
			vault_contract,
			account_id,
		};
		return this.execVaultContractAsCallFunction<T>({ methodName: 'withdraw_all_2', args });
	}

	public async batchTransactionWithdrawAllUserLiquidityPoolAndStorage({
		amount = '0.01',
		account_id = this.getWallet().getAccountId(),
	}): Promise<any> {
		const vaultContractID = this.getVaultContractId();
		const calls: IExecBatchTransaction = [];
		const totalAvailableGas = '300000000000000';
		const withdrawAllLiquididyGas = '190000000000000';
		const storageWithdrawGas = `${Number(totalAvailableGas) - Number(withdrawAllLiquididyGas)}`;

		// liquidity withdraw
		calls.push({
			receiverId: vaultContractID,
			functionsCall: [
				{
					contractId: vaultContractID,
					methodName: 'withdraw_all_2',
					args: {
						vault_contract: vaultContractID,
						account_id,
					},
					gas: new BN(withdrawAllLiquididyGas),
					amount: new BN('0'),
				},
			],
		});

		// storage withdraw
		calls.push({
			receiverId: vaultContractID,
			functionsCall: [
				{
					contractId: vaultContractID,
					methodName: 'storage_withdraw',
					args: {
						amount,
					},
					gas: new BN(storageWithdrawGas),
					amount: new BN('0'),
				},
			],
		});
		// calls.splice(1, 1);
		const responseBatchTransaction = this.execBatchTransaction(calls);
		return {
			calls,
			response: responseBatchTransaction,
		};
	}

	/**
	 * STEP 3/3 FOR WITHDRAW -
	 * USER GET THE WITHDRAW OF WRAP NEAR FROM VAULT TO USER WALLET (LAST STEP OF WITHDRAW)
	 * @description User have some amount in wNear with vault, so this will withdraw to user wallet
	 * @description These wNear will be converted to Near.
	 */
	public async withdrawUserStorage({ amount = '0' }) {
		const args = {
			amount: toNonDivisibleNumber(24, amount),
		};
		return this.execVaultContractAsCallFunction({ methodName: 'storage_withdraw', args });
	}

	/**
	 * GET USER SHARES IN VAULT SMART CONTRACT
	 * @description User have a normalized shares from all users shares in vault
	 * @description This amount refs user participation in vault total share
	 */
	public async getUserShares({
		seed_id = 'exchange.ref-dev.testnet@193',
		account_id = this.getWallet().getAccountId(),
	}): Promise<string> {
		if (seed_id !== 'exchange.ref-dev.testnet@193') {
			return '0';
		}
		seed_id = 'That will be used as argument for filter seed user shares';
		const args = {
			account_id,
		};
		return this.execVaultContractAsViewFunction<string>({ methodName: 'get_user_shares', args });
	}

	/**
	 * GET USER BALANCES STORAGED WITH VAULT
	 * @description THE STORAGE IS BASED ON 2 AMOUNT VALUE TYPE, TAGGED AS AVAILABLE AND TOTAL.
	 * @description AVAILABLE: Amount as "available" means the total wNear the user have available to vault use in all auto compound proccess.
	 * @description TOTSL: Amount as "total" means the total wNear the user have storaged in vault available to gas and tax summed with available amount abbled to user in fit auto compound
	 */
	public async getUserStorageBalance({
		account_id = this.getWallet().getAccountId(),
	}): Promise<{ available: string; total: string }> {
		return this.execVaultContractAsViewFunction({
			methodName: 'storage_balance_of',
			args: { account_id },
		});
	}

	/**
	 * EXEC FUNCTIONS TYPE OF FUNCTION_CALL FROM VAULT SMART CONTRACT
	 * @description If not specified the amount, that coul be a signed transaction, without need to user aprove the transaction
	 * @description When it is not needed to aprove transaction, it not even open ther user wallet
	 */
	public async execVaultContractAsCallFunction<T extends unknown>({
		contractId = this.getProviderConfigData().FLUXUS_VAULT_CONTRACT_ID,
		methodName = '',
		args = {},
		gas = new BN('300000000000000'),
		amount = new BN(0),
	}: IFunctionCall): Promise<T> {
		const functionCallResponse = await this.getWallet()
			.account()
			.functionCall(contractId, methodName, args, gas, amount);
		return functionCallResponse as T;
	}

	/**
	 * EXEC FUNCTIONS TYPE OF FUNCTION_VIEW FROM VAULT SMART CONTRACT
	 * @description It is in mustly case, user wallet sign not be mandatory for work as expected
	 */
	public async execVaultContractAsViewFunction<T extends unknown>({
		contractId = this.getProviderConfigData().FLUXUS_VAULT_CONTRACT_ID,
		methodName = 'storage_balance_of',
		args = {},
	}: {
		contractId?: string;
		methodName?: string;
		args?: Record<any, any>;
	}): Promise<T> {
		const viewFunctionResponse = await this.getWallet().account().viewFunction(contractId, methodName, args);
		return viewFunctionResponse as T;
	}

	/**
	 * EXECUTE MULTIPLE FUNCTIONS CALL AS ONE
	 * CREATE A BATCH TRANSACTION AS FUNCTION CALL TYPE
	 * @description It give sure about function that depends the other for have success.
	 * @description Pay attention to gas needed for each function call.
	 * @description Gas pre-payed have to be calculated carefully before realease some implementation of this
	 */
	public async execBatchTransaction(calls: IExecBatchTransaction) {
		const $this = this;
		const wallet = this.getWallet();
		if (!wallet) {
			throw new Error('Wallet connection is mandatory.');
		}
		const transactions = await Promise.all(
			calls.map((call, index: number) =>
				$this.createBatchTransaction({ receiverId: call.receiverId, functionsCall: call.functionsCall }),
			),
		);
		const args = { transactions };
		return this.getWallet().requestSignTransactions(args);
	}

	/**
	 * create MULTIPLE FUNCTIONS CALL AS ONE
	 * CREATE A BATCH TRANSACTION AS FUNCTION CALL TYPE
	 * @description It give sure about function that depends the other for have success.
	 * @description Pay attention to gas needed for each function call.
	 * @description Gas pre-payed have to be calculated carefully before realease some implementation of this
	 */
	public async createBatchTransaction({ ...params }: { receiverId: string; functionsCall: Array<IFunctionCall> }) {
		const wallet = this.getWallet();
		const { receiverId, functionsCall } = params;

		if (!wallet) {
			throw new Error('Wallet must be connected before create transactions.');
		}
		return wallet.createTransaction({
			receiverId,
			nonceOffset: 1,
			actions: functionsCall.map(fc =>
				functionCall(fc?.methodName || '', fc?.args || {}, fc?.gas || new BN('0'), fc?.amount || new BN('0')),
			),
		});
	}
}
