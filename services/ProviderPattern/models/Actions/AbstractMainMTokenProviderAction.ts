import BN from 'bn.js';
import * as math from 'mathjs';
import { utils } from 'near-api-js';
import { toNonDivisibleNumber } from '@utils/numbers';
import { ONE_YOCTO_NEAR, Transaction, executeFarmMultipleTransactions } from '@services/near';
import { TokenMetadata } from '@ProviderPattern/models/Actions/AbstractMainFTContractProviderAction';
import { ACCOUNT_MIN_STORAGE_AMOUNT } from '@ProviderPattern/models/Actions/AbstractMainAccountProviderAction';
import {
	MIN_DEPOSIT_PER_TOKEN,
	storageDepositAction,
	STORAGE_PER_TOKEN,
	STORAGE_TO_REGISTER_WITH_MFT,
	MIN_DEPOSIT_PER_TOKEN_FARM,
} from '@services/creators/storage';
import ProviderPattern from '@ProviderPattern/index';
import AbstractGenericActions from '@ProviderPattern/models/Actions/AbstractGenericActions';
import AbstractMainProviderActions from '@ProviderPattern/models/Actions/AbstractMainProviderActions';

export const LP_TOKEN_DECIMALS = 24;
export const FARM_STORAGE_BALANCE = '0.045';

interface StakeOptions {
	token_id: string;
	amount: string;
	msg?: string;
	useFluxusFarmContract?: boolean;
}

interface UnstakeOptions {
	seed_id: string;
	amount: string;
	msg?: string;
}

interface WithdrawOptions {
	token_id: string;
	amount: string;
	token: TokenMetadata;
	unregister?: boolean;
	useFluxusFarmContract?: boolean;
}

export default class AbstractMainMTokenProviderAction extends AbstractGenericActions {
	protected static _classInstanceSingleton: AbstractMainMTokenProviderAction;

	protected declare _providerActionsInstace: AbstractMainProviderActions;

	public static getInstance(providerActionsInstance: AbstractMainProviderActions) {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp(providerActionsInstance);
		return this._classInstanceSingleton;
	}

	async checkTokenNeedsStorageDeposit(page?: string, useFluxusFarmContract = false) {
		let storageNeeded: math.MathType = 0;
		const balance = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getAccountActions()
			.currentStorageBalanceOfFarm(this.getWallet().getAccountId(), useFluxusFarmContract);

		if (!balance) {
			storageNeeded = math.add(storageNeeded, Number(ACCOUNT_MIN_STORAGE_AMOUNT));
		}
		if ((page && page === 'farm') || `${page || ''}`.toLocaleUpperCase() === 'farm'.toLocaleUpperCase()) {
			if (new BN(balance?.available || '0').lt(MIN_DEPOSIT_PER_TOKEN_FARM)) {
				storageNeeded = math.add(storageNeeded, Number(FARM_STORAGE_BALANCE));
			}
		} else if (new BN(balance?.available || '0').lt(MIN_DEPOSIT_PER_TOKEN)) {
			storageNeeded = math.add(storageNeeded, Number(STORAGE_PER_TOKEN));
		}
		return storageNeeded ? storageNeeded.toString() : '';
	}

	/**
	 * Do stake operation for users through the exchange smart contract to the farm smart contract
	 */
	async stake({ token_id, amount, msg = '', useFluxusFarmContract = false }: StakeOptions) {
		amount = toNonDivisibleNumber(LP_TOKEN_DECIMALS, amount);
		const receiverFarmId = `${
			useFluxusFarmContract
				? this.getProviderConfigData().FLUXUS_FARM_CONTRACT_ID
				: this.getProviderConfigData().REF_FARM_CONTRACT_ID
		}`;
		const transactions: Transaction[] = [
			{
				receiverId: this.getProviderConfigData().REF_FI_CONTRACT_ID || '',
				functionCalls: [
					{
						methodName: 'mft_transfer_call',
						args: {
							receiver_id: receiverFarmId,
							token_id,
							amount,
							msg,
						},
						amount: ONE_YOCTO_NEAR,
						gas: '180000000000000',
					},
				],
			},
		];
		const neededStorage = await this.checkTokenNeedsStorageDeposit('farm', useFluxusFarmContract);
		if (neededStorage) {
			transactions.unshift({
				receiverId: receiverFarmId,
				functionCalls: [storageDepositAction({ amount: FARM_STORAGE_BALANCE })],
			});
		}
		return executeFarmMultipleTransactions(transactions);
	}

	async unstake({
		seed_id,
		amount,
		msg = '',
		useFluxusFarmContract = false,
	}: UnstakeOptions & { useFluxusFarmContract?: boolean }) {
		const receiverId = (
			useFluxusFarmContract
				? this.getProviderConfigData().FLUXUS_FARM_CONTRACT_ID
				: this.getProviderConfigData().REF_FARM_CONTRACT_ID
		) as string;
		const transactions: Transaction[] = [
			{
				receiverId,
				functionCalls: [
					{
						methodName: 'withdraw_seed',
						args: {
							seed_id,
							amount: toNonDivisibleNumber(LP_TOKEN_DECIMALS, amount),
							msg,
						},
						amount: ONE_YOCTO_NEAR,
						gas: '200000000000000',
					},
				],
			},
		];

		const neededStorage = await this.checkTokenNeedsStorageDeposit('farm', useFluxusFarmContract);
		if (neededStorage) {
			transactions.unshift({
				receiverId,
				functionCalls: [storageDepositAction({ amount: FARM_STORAGE_BALANCE })],
			});
		}

		return executeFarmMultipleTransactions(transactions);
	}

	async withdrawReward({
		token_id,
		amount,
		token,
		unregister = false,
		useFluxusFarmContract = false,
	}: WithdrawOptions) {
		const receiverContractId = `${
			useFluxusFarmContract
				? this.getProviderConfigData().FLUXUS_FARM_CONTRACT_ID
				: this.getProviderConfigData().REF_FARM_CONTRACT_ID
		}`;

		const transactions: Transaction[] = [];
		const parsedAmount = toNonDivisibleNumber(token.decimals, amount);
		const ftBalance = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFTContractActions()
			.ftGetStorageBalance(token_id);

		if (!ftBalance || ftBalance.total === '0') {
			transactions.unshift({
				receiverId: token_id,
				functionCalls: [
					storageDepositAction({
						registrationOnly: true,
						amount: STORAGE_TO_REGISTER_WITH_MFT,
					}),
				],
			});
		}

		transactions.push({
			receiverId: receiverContractId,
			functionCalls: [
				{
					methodName: 'withdraw_reward',
					args: { token_id, amount: parsedAmount, unregister },
					gas: '100000000000000',
					amount: ONE_YOCTO_NEAR,
				},
			],
		});

		if (token_id === this.getProviderConfigData().WRAP_NEAR_CONTRACT_ID) {
			transactions.push({
				receiverId: this.getProviderConfigData().WRAP_NEAR_CONTRACT_ID,
				functionCalls: [
					{
						methodName: 'near_withdraw',
						args: { amount: utils.format.parseNearAmount(amount) },
						amount: ONE_YOCTO_NEAR,
					},
				],
			});
		}

		return executeFarmMultipleTransactions(transactions);
	}

	async withdrawAllReward(checkedList: Record<string, any>, unregister = false, useFluxusFarmContract = false) {
		const transactions: Transaction[] = [];
		const token_id_list = Object.keys(checkedList);
		const ftBalancePromiseList: any[] = [];
		const functionCalls: any[] = [];

		token_id_list.forEach(token_id => {
			const ftBalance = ProviderPattern.getInstance()
				.getProvider()
				.getProviderActions()
				.getFTContractActions()
				.ftGetStorageBalance(token_id);
			ftBalancePromiseList.push(ftBalance);
			functionCalls.push({
				methodName: 'withdraw_reward',
				args: {
					token_id,
					amount: checkedList[token_id].value,
					unregister,
				},
				gas: '40000000000000',
				amount: ONE_YOCTO_NEAR,
			});
		});
		const resolvedBalanceList = await Promise.all(ftBalancePromiseList);
		resolvedBalanceList.forEach((ftBalance, index) => {
			if (!ftBalance || ftBalance.total === '0') {
				transactions.unshift({
					receiverId: token_id_list[index],
					functionCalls: [
						storageDepositAction({
							registrationOnly: true,
							amount: STORAGE_TO_REGISTER_WITH_MFT,
						}),
					],
				});
			}
		});
		const transactionsFarmContract = `${
			useFluxusFarmContract
				? this.getProviderConfigData().FLUXUS_FARM_CONTRACT_ID
				: this.getProviderConfigData().REF_FARM_CONTRACT_ID
		}`;
		transactions.push({
			receiverId: transactionsFarmContract,
			functionCalls,
		});

		return executeFarmMultipleTransactions(transactions);
	}
}
