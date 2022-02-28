import BN from 'bn.js';
import * as math from 'mathjs';
import {
	ONE_YOCTO_NEAR,
	RefFiFunctionCallOptions,
	refFiManyFunctionCalls,
	refFiViewFunction,
	Transaction,
	REF_FI_CONTRACT_ID,
	executeMultipleTransactions,
} from '@services/near';
import { TokenMetadata } from '@ProviderPattern/models/Actions/AbstractMainFTContractProviderAction';
import { ACCOUNT_MIN_STORAGE_AMOUNT } from '@ProviderPattern/models/Actions/AbstractMainAccountProviderAction';
import { toNonDivisibleNumber } from '@utils/numbers';
import {
	MIN_DEPOSIT_PER_TOKEN,
	STORAGE_TO_REGISTER_WITH_FT,
	storageDepositAction,
	storageDepositForFTAction,
	needDepositStorage,
	STORAGE_PER_TOKEN,
	ONE_MORE_DEPOSIT_AMOUNT,
} from '@services/creators/storage';
import { unwrapNear, WRAP_NEAR_CONTRACT_ID } from '@services/wrap-near';
import { registerTokenAction } from '@services/creators/token';
import ProviderPattern from '@ProviderPattern/index';
import AbstractMainProviderActions from './AbstractMainProviderActions';
import AbstractGenericActions from './AbstractGenericActions';

interface DepositOptions {
	token: TokenMetadata;
	amount: string;
	msg?: string;
}
interface WithdrawOptions {
	token: TokenMetadata;
	amount: string;
	unregister?: boolean;
}

export interface TokenBalancesView {
	[tokenId: string]: string;
}

export default class AbstractMainTokenProviderActions extends AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AbstractMainTokenProviderActions;

	protected declare _providerActionsInstace: AbstractMainProviderActions;

	public static getInstance(providerActionsInstance: AbstractMainProviderActions) {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp(providerActionsInstance);
		return this._classInstanceSingleton;
	}

	public getProviderActionsInstace() {
		return this._providerActionsInstace;
	}

	public async checkTokenNeedsStorageDeposit() {
		this.devImplementation = true;
		let storageNeeded: math.MathType = 0;

		const needDeposit = await needDepositStorage();
		if (needDeposit) {
			storageNeeded = Number(ONE_MORE_DEPOSIT_AMOUNT);
		} else {
			const balance = await Promise.resolve(
				this.getProviderActionsInstace()
					.getAccountActions()
					.currentStorageBalance(this.getWallet().getAccountId()),
			);

			if (!balance) {
				storageNeeded = math.add(storageNeeded, Number(ACCOUNT_MIN_STORAGE_AMOUNT));
			}

			if (new BN(balance?.available || '0').lt(MIN_DEPOSIT_PER_TOKEN)) {
				storageNeeded = math.add(storageNeeded, Number(STORAGE_PER_TOKEN));
			}
		}

		return storageNeeded ? storageNeeded.toString() : '';
	}

	public async registerTokenAndExchange(tokenId: string) {
		const transactions: Transaction[] = [];
		const actions: RefFiFunctionCallOptions[] = [
			{
				methodName: 'register_tokens',
				args: { token_ids: [tokenId] },
				amount: ONE_YOCTO_NEAR,
			},
		];

		const neededStorage = await this.checkTokenNeedsStorageDeposit();

		if (neededStorage) {
			actions.unshift(storageDepositAction({ amount: neededStorage }));
		}

		transactions.push({
			receiverId: REF_FI_CONTRACT_ID,
			functionCalls: actions,
		});

		const exchangeBalanceAtFt = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFTContractActions()
			.ftGetStorageBalance(tokenId, REF_FI_CONTRACT_ID);
		if (!exchangeBalanceAtFt || exchangeBalanceAtFt.total === '0') {
			transactions.push({
				receiverId: tokenId,
				functionCalls: [storageDepositForFTAction()],
			});
		}

		return executeMultipleTransactions(transactions);
	}

	public async registerToken(tokenId: string) {
		const registered = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFTContractActions()
			.ftGetStorageBalance(tokenId, REF_FI_CONTRACT_ID)
			.catch(() => {
				throw new Error(`${tokenId} doesn't exist.`);
			});
		if (!registered) throw new Error('No liquidity pools available for token');

		const actions: RefFiFunctionCallOptions[] = [registerTokenAction(tokenId)];

		const neededStorage = await this.checkTokenNeedsStorageDeposit();
		if (neededStorage) {
			actions.unshift(storageDepositAction({ amount: neededStorage }));
		}

		return refFiManyFunctionCalls(actions);
	}

	public async unregisterToken(tokenId: string) {
		const actions: RefFiFunctionCallOptions[] = [
			{
				methodName: 'unregister_tokens',
				args: { token_ids: [tokenId] },
				amount: ONE_YOCTO_NEAR,
			},
		];

		const neededStorage = await this.checkTokenNeedsStorageDeposit();

		if (neededStorage) {
			actions.unshift(storageDepositAction({ amount: neededStorage }));
		}

		return refFiManyFunctionCalls(actions);
	}

	public async deposit({ token, amount, msg = '' }: DepositOptions) {
		const transactions: Transaction[] = [
			{
				receiverId: token.id,
				functionCalls: [
					{
						methodName: 'ft_transfer_call',
						args: {
							receiver_id: REF_FI_CONTRACT_ID,
							amount: toNonDivisibleNumber(token.decimals, amount),
							msg,
						},
						amount: ONE_YOCTO_NEAR,
						gas: '100000000000000',
					},
				],
			},
		];

		const neededStorage = await this.checkTokenNeedsStorageDeposit();
		if (neededStorage) {
			transactions.unshift({
				receiverId: REF_FI_CONTRACT_ID,
				functionCalls: [storageDepositAction({ amount: neededStorage })],
			});
		}

		return executeMultipleTransactions(transactions);
	}

	public async withdraw({ token, amount, unregister = false }: WithdrawOptions) {
		if (token.id === WRAP_NEAR_CONTRACT_ID) {
			return unwrapNear(amount);
		}

		const transactions: Transaction[] = [];
		const parsedAmount = toNonDivisibleNumber(token.decimals, amount);
		const ftBalance = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFTContractActions()
			.ftGetStorageBalance(token.id);

		transactions.unshift({
			receiverId: REF_FI_CONTRACT_ID,
			functionCalls: [
				{
					methodName: 'withdraw',
					args: { token_id: token.id, amount: parsedAmount, unregister },
					gas: '100000000000000',
					amount: ONE_YOCTO_NEAR,
				},
			],
		});

		if (!ftBalance || ftBalance.total === '0') {
			transactions.unshift({
				receiverId: token.id,
				functionCalls: [
					storageDepositAction({
						registrationOnly: true,
						amount: STORAGE_TO_REGISTER_WITH_FT,
					}),
				],
			});
		}

		const neededStorage = await this.checkTokenNeedsStorageDeposit();
		if (neededStorage) {
			transactions.unshift({
				receiverId: REF_FI_CONTRACT_ID,
				functionCalls: [storageDepositAction({ amount: neededStorage })],
			});
		}

		return executeMultipleTransactions(transactions);
	}

	public getTokenBalances(fluxusContractName = '', debug = false): Promise<TokenBalancesView> {
		this.devImplementation = true;
		const wallet = this.getWallet();
		return refFiViewFunction({
			methodName: 'get_deposits',
			args: { account_id: wallet.getAccountId() },
			fluxusContractName,
			debug,
		});
	}

	public getTokenBalance(tokenId: string): Promise<number> {
		this.devImplementation = true;
		const wallet = this.getWallet();
		return refFiViewFunction({
			methodName: 'get_deposit',
			args: { account_id: wallet.getAccountId(), token_id: tokenId },
		});
	}

	public async getUserTokenBalances({
		account_id = this.getWallet().getAccountId(),
		contract_id = '',
		debug = false,
	}): Promise<TokenBalancesView> {
		this.devImplementation = true;
		const args = { account_id };
		const methodName = 'get_deposits';
		const tokenBalancesViewResponse = await refFiViewFunction({
			methodName,
			args,
			fluxusContractName: contract_id,
			debug,
		});

		return { ...tokenBalancesViewResponse } as TokenBalancesView;
	}

	public getUserRegisteredTokens(
		accountId: string = this.getWallet().getAccountId(),
		fluxusContractName = '',
		debug = false,
	): Promise<string[]> {
		this.devImplementation = true;
		return refFiViewFunction({
			methodName: 'get_user_whitelisted_tokens',
			args: { account_id: accountId },
			fluxusContractName,
			debug,
		});
	}

	public async getWhitelistedTokens(fluxusContractName = '', debug = false): Promise<string[]> {
		this.devImplementation = true;
		const wallet = this.getWallet();
		let userWhitelist = [];
		const globalWhitelist = (await refFiViewFunction({
			methodName: 'get_whitelisted_tokens',
			fluxusContractName,
			debug,
		})) as Array<any>;
		if (wallet.isSignedIn()) {
			userWhitelist = (await refFiViewFunction({
				methodName: 'get_user_whitelisted_tokens',
				args: { account_id: wallet.getAccountId() },
				fluxusContractName,
				debug,
			})) as Array<any>;
		}

		return [...new Set<string>([...globalWhitelist, ...userWhitelist])];
	}

	public round(decimals: number, minAmountOut: string) {
		this.devImplementation = true;
		return Number.isInteger(Number(minAmountOut))
			? minAmountOut
			: Math.ceil(Math.round(Number(minAmountOut) * 10 ** decimals) / 10 ** decimals).toString();
	}
}
