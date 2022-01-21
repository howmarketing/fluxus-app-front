import BN from 'bn.js';
import * as math from 'mathjs';
import { utils } from 'near-api-js';
import { toNonDivisibleNumber } from '@utils/numbers';
import { WRAP_NEAR_CONTRACT_ID } from '@services/wrap-near';
import {
	ONE_YOCTO_NEAR,
	Transaction,
	executeFarmMultipleTransactions,
	REF_FI_CONTRACT_ID,
	FLUXUS_CONTRACT_ID,
	REF_FARM_CONTRACT_ID,
	FLUXUS_FARM_CONTRACT_ID,
	getWallet,
} from '@services/near';
import { ftGetStorageBalance, TokenMetadata } from '../services/ft-contract';
import { ACCOUNT_MIN_STORAGE_AMOUNT, currentStorageBalanceOfFarm } from '../services/account';
import {
	MIN_DEPOSIT_PER_TOKEN,
	storageDepositAction,
	STORAGE_PER_TOKEN,
	STORAGE_TO_REGISTER_WITH_MFT,
	MIN_DEPOSIT_PER_TOKEN_FARM,
} from '../services/creators/storage';

export const LP_TOKEN_DECIMALS = 24;
export const FARM_STORAGE_BALANCE = '0.045';

export const checkTokenNeedsStorageDeposit = async (page?: string, useFluxusFarmContract = false) => {
	let storageNeeded: math.MathType = 0;
	const balance = await currentStorageBalanceOfFarm(getWallet().getAccountId(), useFluxusFarmContract);

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
};

interface StakeOptions {
	token_id: string;
	amount: string;
	msg?: string;
	useFluxusFarmContract?: boolean;
}

/**
 * Do stake operation for users through the exchange smart contract to the farm smart contract
 * @description
 *
 * @param {StakeOptions} props
 * @returns {Promise<void>}
 */
export const stake = async ({ token_id, amount, msg = '', useFluxusFarmContract = false }: StakeOptions) => {
	amount = toNonDivisibleNumber(LP_TOKEN_DECIMALS, amount);
	const receiverFarmId = useFluxusFarmContract ? FLUXUS_FARM_CONTRACT_ID : REF_FARM_CONTRACT_ID;
	const transactions: Transaction[] = [
		{
			receiverId: REF_FI_CONTRACT_ID,
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
	const neededStorage = await checkTokenNeedsStorageDeposit('farm', useFluxusFarmContract);
	if (neededStorage) {
		transactions.unshift({
			receiverId: receiverFarmId,
			functionCalls: [storageDepositAction({ amount: FARM_STORAGE_BALANCE })],
		});
	}
	return executeFarmMultipleTransactions(transactions);
};

interface UnstakeOptions {
	seed_id: string;
	amount: string;
	msg?: string;
}
export const unstake = async ({
	seed_id,
	amount,
	msg = '',
	useFluxusFarmContract = false,
}: UnstakeOptions & { useFluxusFarmContract?: boolean }) => {
	console.log({ amount, div: toNonDivisibleNumber(LP_TOKEN_DECIMALS, amount) });

	const transactions: Transaction[] = [
		{
			receiverId: useFluxusFarmContract ? FLUXUS_FARM_CONTRACT_ID : REF_FARM_CONTRACT_ID,
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

	const neededStorage = await checkTokenNeedsStorageDeposit('farm', useFluxusFarmContract);
	if (neededStorage) {
		transactions.unshift({
			receiverId: useFluxusFarmContract ? FLUXUS_FARM_CONTRACT_ID : REF_FARM_CONTRACT_ID,
			functionCalls: [storageDepositAction({ amount: FARM_STORAGE_BALANCE })],
		});
	}

	return executeFarmMultipleTransactions(transactions);
};

interface WithdrawOptions {
	token_id: string;
	amount: string;
	token: TokenMetadata;
	unregister?: boolean;
	useFluxusFarmContract?: boolean;
}

export const withdrawReward = async ({
	token_id,
	amount,
	token,
	unregister = false,
	useFluxusFarmContract = false,
}: WithdrawOptions) => {
	const transactions: Transaction[] = [];

	const parsedAmount = toNonDivisibleNumber(token.decimals, amount);
	const ftBalance = await ftGetStorageBalance(token_id);

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
		receiverId: useFluxusFarmContract ? FLUXUS_FARM_CONTRACT_ID : REF_FARM_CONTRACT_ID,
		functionCalls: [
			{
				methodName: 'withdraw_reward',
				args: { token_id, amount: parsedAmount, unregister },
				gas: '100000000000000',
				amount: ONE_YOCTO_NEAR,
			},
		],
	});

	if (token_id === WRAP_NEAR_CONTRACT_ID) {
		transactions.push({
			receiverId: WRAP_NEAR_CONTRACT_ID,
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
};

export const withdrawAllReward = async (
	checkedList: Record<string, any>,
	unregister = false,
	useFluxusFarmContract = false,
) => {
	// console.log('withdrawAllReward (useFluxusFarmContract): ', useFluxusFarmContract);
	// console.log('withdrawAllReward (checkedList): ', checkedList);
	// return;
	const transactions: Transaction[] = [];
	const token_id_list = Object.keys(checkedList);
	const ftBalancePromiseList: any[] = [];
	const functionCalls: any[] = [];

	token_id_list.forEach(token_id => {
		const ftBalance = ftGetStorageBalance(token_id);
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
	const transactionsFarmContract = useFluxusFarmContract ? FLUXUS_FARM_CONTRACT_ID : REF_FARM_CONTRACT_ID;
	transactions.push({
		receiverId: transactionsFarmContract,
		functionCalls,
	});

	// console.log('Withdraw transactions: ', transactions);
	// console.log('120 seconds to redirect to confirmation');
	// await new Promise(resolve => {
	// 	setTimeout(() => {
	// 		resolve(true);
	// 	}, 12000);
	// });
	return executeFarmMultipleTransactions(transactions);
};
