import BN from 'bn.js';
import * as math from 'mathjs';
import {
	ONE_YOCTO_NEAR,
	RefFiFunctionCallOptions,
	refFiManyFunctionCalls,
	refFiViewFunction,
	Transaction,
	REF_FI_CONTRACT_ID,
	getWallet,
	executeMultipleTransactions,
} from './near';
import { ftGetStorageBalance, TokenMetadata } from './ft-contract';
import { ACCOUNT_MIN_STORAGE_AMOUNT, currentStorageBalance } from './account';
import { toNonDivisibleNumber } from '../utils/numbers';
import {
	MIN_DEPOSIT_PER_TOKEN,
	STORAGE_TO_REGISTER_WITH_FT,
	storageDepositAction,
	storageDepositForFTAction,
	needDepositStorage,
	STORAGE_PER_TOKEN,
	ONE_MORE_DEPOSIT_AMOUNT,
} from './creators/storage';
import { unwrapNear, WRAP_NEAR_CONTRACT_ID } from './wrap-near';
import { registerTokenAction } from './creators/token';

export const checkTokenNeedsStorageDeposit = async () => {
	let storageNeeded: math.MathType = 0;

	const needDeposit = await needDepositStorage();
	if (needDeposit) {
		storageNeeded = Number(ONE_MORE_DEPOSIT_AMOUNT);
	} else {
		const balance = await Promise.resolve(currentStorageBalance(getWallet().getAccountId()));

		if (!balance) {
			storageNeeded = math.add(storageNeeded, Number(ACCOUNT_MIN_STORAGE_AMOUNT));
		}

		if (new BN(balance?.available || '0').lt(MIN_DEPOSIT_PER_TOKEN)) {
			storageNeeded = math.add(storageNeeded, Number(STORAGE_PER_TOKEN));
		}
	}

	return storageNeeded ? storageNeeded.toString() : '';
};

export const registerTokenAndExchange = async (tokenId: string) => {
	const transactions: Transaction[] = [];
	const actions: RefFiFunctionCallOptions[] = [
		{
			methodName: 'register_tokens',
			args: { token_ids: [tokenId] },
			amount: ONE_YOCTO_NEAR,
		},
	];

	const neededStorage = await checkTokenNeedsStorageDeposit();

	if (neededStorage) {
		actions.unshift(storageDepositAction({ amount: neededStorage }));
	}

	transactions.push({
		receiverId: REF_FI_CONTRACT_ID,
		functionCalls: actions,
	});

	const exchangeBalanceAtFt = await ftGetStorageBalance(tokenId, REF_FI_CONTRACT_ID);
	if (!exchangeBalanceAtFt || exchangeBalanceAtFt.total === '0') {
		transactions.push({
			receiverId: tokenId,
			functionCalls: [storageDepositForFTAction()],
		});
	}

	return executeMultipleTransactions(transactions);
};

export const registerToken = async (tokenId: string) => {
	const registered = await ftGetStorageBalance(tokenId, REF_FI_CONTRACT_ID).catch(() => {
		throw new Error(`${tokenId} doesn't exist.`);
	});
	if (!registered) throw new Error('No liquidity pools available for token');

	const actions: RefFiFunctionCallOptions[] = [registerTokenAction(tokenId)];

	const neededStorage = await checkTokenNeedsStorageDeposit();
	if (neededStorage) {
		actions.unshift(storageDepositAction({ amount: neededStorage }));
	}

	return refFiManyFunctionCalls(actions);
};

export const unregisterToken = async (tokenId: string) => {
	const actions: RefFiFunctionCallOptions[] = [
		{
			methodName: 'unregister_tokens',
			args: { token_ids: [tokenId] },
			amount: ONE_YOCTO_NEAR,
		},
	];

	const neededStorage = await checkTokenNeedsStorageDeposit();

	if (neededStorage) {
		actions.unshift(storageDepositAction({ amount: neededStorage }));
	}

	return refFiManyFunctionCalls(actions);
};

interface DepositOptions {
	token: TokenMetadata;
	amount: string;
	msg?: string;
}

export const deposit = async ({ token, amount, msg = '' }: DepositOptions) => {
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

	const neededStorage = await checkTokenNeedsStorageDeposit();
	if (neededStorage) {
		transactions.unshift({
			receiverId: REF_FI_CONTRACT_ID,
			functionCalls: [storageDepositAction({ amount: neededStorage })],
		});
	}

	return executeMultipleTransactions(transactions);
};

interface WithdrawOptions {
	token: TokenMetadata;
	amount: string;
	unregister?: boolean;
}

export const withdraw = async ({ token, amount, unregister = false }: WithdrawOptions) => {
	if (token.id === WRAP_NEAR_CONTRACT_ID) {
		return unwrapNear(amount);
	}

	const transactions: Transaction[] = [];
	const parsedAmount = toNonDivisibleNumber(token.decimals, amount);
	const ftBalance = await ftGetStorageBalance(token.id);

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

	const neededStorage = await checkTokenNeedsStorageDeposit();
	if (neededStorage) {
		transactions.unshift({
			receiverId: REF_FI_CONTRACT_ID,
			functionCalls: [storageDepositAction({ amount: neededStorage })],
		});
	}

	return executeMultipleTransactions(transactions);
};

export interface TokenBalancesView {
	[tokenId: string]: string;
}

export const getTokenBalances = (fluxusContractName = '', debug = false): Promise<TokenBalancesView> =>
	refFiViewFunction({
		methodName: 'get_deposits',
		args: { account_id: getWallet().getAccountId() },
		fluxusContractName,
		debug,
	});

export const getUserTokenBalances = async ({
	account_id = getWallet().getAccountId(),
	contract_id = '',
	debug = false,
}): Promise<TokenBalancesView> => {
	const args = { account_id };
	const methodName = 'get_deposits';
	if (debug) {
		console.log('getUserTokenBalances(DEBUG LOG): ', {
			params: { methodName, args, account_id, fluxusContractName: contract_id, debug },
		});
		return {} as TokenBalancesView;
	}
	const tokenBalancesViewResponse = await refFiViewFunction({
		methodName,
		args,
		fluxusContractName: contract_id,
		debug,
	});

	return { ...tokenBalancesViewResponse } as TokenBalancesView;
};

export const getTokenBalance = (tokenId: string): Promise<number> =>
	refFiViewFunction({
		methodName: 'get_deposit',
		args: { account_id: getWallet().getAccountId(), token_id: tokenId },
	});

export const getUserRegisteredTokens = (
	accountId: string = getWallet().getAccountId(),
	fluxusContractName = '',
	debug = false,
): Promise<string[]> =>
	refFiViewFunction({
		methodName: 'get_user_whitelisted_tokens',
		args: { account_id: accountId },
		fluxusContractName,
		debug,
	});

export const getWhitelistedTokens = async (fluxusContractName = '', debug = false): Promise<string[]> => {
	let userWhitelist = [];
	const globalWhitelist = (await refFiViewFunction({
		methodName: 'get_whitelisted_tokens',
		fluxusContractName,
		debug,
	})) as Array<any>;
	if (getWallet().isSignedIn()) {
		userWhitelist = (await refFiViewFunction({
			methodName: 'get_user_whitelisted_tokens',
			args: { account_id: getWallet().getAccountId() },
			fluxusContractName,
			debug,
		})) as Array<any>;
	}

	return [...new Set<string>([...globalWhitelist, ...userWhitelist])];
};

export const round = (decimals: number, minAmountOut: string) =>
	Number.isInteger(Number(minAmountOut))
		? minAmountOut
		: Math.ceil(Math.round(Number(minAmountOut) * 10 ** decimals) / 10 ** decimals).toString();
