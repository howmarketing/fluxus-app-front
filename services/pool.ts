/* eslint-disable camelcase */
import BN from 'bn.js';
import { getTopPools } from '@services/indexer';
import { checkTokenNeedsStorageDeposit } from '@services/token';
import {
	executeMultipleTransactions,
	LP_STORAGE_AMOUNT,
	ONE_YOCTO_NEAR,
	refFiViewFunction,
	REF_FI_CONTRACT_ID,
	Transaction,
	getWallet,
	RefFiFunctionCallOptions,
	refFiManyFunctionCalls,
} from './near';
import { ftGetStorageBalance, TokenMetadata } from './ft-contract';
import { toNonDivisibleNumber } from '../utils/numbers';
import { storageDepositAction, storageDepositForFTAction } from './creators/storage';
import { PoolRPCView } from './api';

export const DEFAULT_PAGE_LIMIT = 100;

export interface Pool {
	id: number;
	tokenIds: string[];
	supplies: { [key: string]: string };
	fee: number;
	shareSupply: string;
	tvl: number;
	token0_ref_price: string;
}

export const parsePool = (pool: PoolRPCView, id?: number): Pool => ({
	id: typeof id !== 'undefined' && id >= 0 ? id : pool.id,
	tokenIds: pool.token_account_ids,
	supplies: pool.amounts.reduce((acc: { [tokenId: string]: string }, amount: string, i: number) => {
		acc[pool.token_account_ids[i]] = amount;
		return acc;
	}, {}),
	fee: pool.total_fee,
	shareSupply: pool.shares_total_supply,
	tvl: pool.tvl,
	token0_ref_price: pool.token0_ref_price,
});

export const getPools = async ({
	page = 1,
	perPage = DEFAULT_PAGE_LIMIT,
	tokenName = '',
	column = '',
	order = 'desc',
	uniquePairName = false,
}: {
	page?: number;
	perPage?: number;
	tokenName?: string;
	column?: string;
	order?: string;
	uniquePairName?: boolean;
}): Promise<Pool[]> => {
	const poolData: PoolRPCView[] = await getTopPools({
		page,
		perPage,
		tokenName,
		column,
		order,
		uniquePairName,
	});
	if (poolData.length > 0) {
		return poolData.map(rawPool => parsePool(rawPool));
	}
	return [];
};

export const getPoolsFromIndexer = async ({
	page = 1,
	perPage = DEFAULT_PAGE_LIMIT,
	tokenName = '',
	column = '',
	order = 'desc',
	uniquePairName = false,
}: {
	page?: number;
	perPage?: number;
	tokenName?: string;
	column?: string;
	order?: string;
	uniquePairName?: boolean;
}): Promise<Pool[]> => {
	const poolData: PoolRPCView[] = await getTopPools({
		page,
		perPage,
		tokenName,
		column,
		order,
		uniquePairName,
	});

	return poolData.map(rawPool => parsePool(rawPool));
};

export const getTotalPools = () =>
	refFiViewFunction({
		methodName: 'get_number_of_pools',
	});

export const getAllPools = async (page: number = 1, perPage: number = DEFAULT_PAGE_LIMIT): Promise<Pool[]> => {
	const index = (page - 1) * perPage;
	const poolData: PoolRPCView[] = await refFiViewFunction({
		methodName: 'get_pools',
		args: { from_index: index, limit: perPage },
	});

	return poolData.map((rawPool, i) => parsePool(rawPool, i + index));
};

interface GetPoolOptions {
	tokenInId: string;
	tokenOutId: string;
	amountIn: string;
	setLoadingTrigger?: (loadingTrigger: boolean) => void;
	setLoadingData?: (loading: boolean) => void;
	loadingTrigger: boolean;
}

export const getPoolsByTokens = async ({
	tokenInId,
	tokenOutId,
	amountIn,
	setLoadingData,
	setLoadingTrigger,
	loadingTrigger,
}: GetPoolOptions): Promise<Pool[]> => {
	const amountToTrade = new BN(amountIn);
	let filtered_pools: Pool[] = [];

	if (typeof setLoadingData === 'function') {
		setLoadingData(true);
	}
	const totalPools = await getTotalPools();
	const pages = Math.ceil(totalPools / DEFAULT_PAGE_LIMIT);
	const pools = (await Promise.all([...Array(pages)].map((_, i) => getAllPools(i + 1)))).flat();

	filtered_pools = pools.filter(
		p => new BN(p.supplies[tokenInId]).gte(amountToTrade) && p.supplies[tokenOutId],
	) as Pool[];

	if (typeof setLoadingTrigger === 'function') {
		setLoadingTrigger(false);
	}
	if (typeof setLoadingData === 'function') {
		setLoadingData(false);
	}
	return filtered_pools;
};

export const getPool = async (id: number): Promise<Pool> =>
	refFiViewFunction({
		methodName: 'get_pool',
		args: { pool_id: id },
	}).then((pool: PoolRPCView) => parsePool(pool, id));

interface PoolVolumes {
	[tokenId: string]: { input: string; output: string };
}
export type PoolDetails = Pool & { volumes: PoolVolumes };
export const getPoolDetails = async (id: number): Promise<PoolDetails> => {
	const [pool, volumes] = await Promise.all([
		getPool(id),
		refFiViewFunction({
			methodName: 'get_pool_volumes',
			args: { pool_id: id },
		}),
	]);

	return {
		...pool,
		volumes: pool.tokenIds.reduce((acc: PoolVolumes, tokenId, i) => {
			acc[tokenId] = volumes[i];
			return acc;
		}, {}),
	};
};

export const getPoolVolumes = async (id: number): Promise<PoolVolumes> => (await getPoolDetails(id)).volumes;

export const getSharesInPool = ({ pool_id = 0, accountId = getWallet().getAccountId() }): Promise<string> => {
	const returnEmpty = async (): Promise<string> => '0';
	if (!getWallet().isSignedIn()) {
		return returnEmpty();
	}
	try {
		const execRefViewFunction = async (): Promise<string> => {
			const params = {
				methodName: 'get_pool_shares',
				args: { pool_id, account_id: accountId },
			};
			const result = await refFiViewFunction(params);
			return result;
		};
		const result = execRefViewFunction();
		return result;
	} catch (e: any) {
		// Error log
		console.log(`getSharesInPool error:`, `${e?.message || 'unknown error'}`);
		return returnEmpty();
	}
};

/**
 * NOT IMPLEMENTED YET
 * @param {number} id
 * @returns {Promise<string>} Return a user rewards list
 */
export const getRewards = (id: number): Promise<string> =>
	refFiViewFunction({
		methodName: 'list_rewards',
		args: { account_id: getWallet().getAccountId() },
	});

/**
 * NOT IMPLEMENTED YET
 * @param {number} pool_id
 * @param {boolean} withEnded
 * @returns {Promise<number>} Return farm count for this pool
 */
export const canFarm = async (pool_id: number, withEnded?: boolean): Promise<Number> =>
	new Promise<Number>((resolve, reject) => {
		resolve(pool_id);
	});

interface AddLiquidityToPoolOptions {
	id: number;
	tokenAmounts: { token: TokenMetadata; amount: string }[];
}
export const addLiquidityToPool = async ({ id, tokenAmounts }: AddLiquidityToPoolOptions) => {
	const amounts = tokenAmounts.map(({ token, amount }) => toNonDivisibleNumber(token.decimals, amount));
	const actions: RefFiFunctionCallOptions[] = [
		{
			methodName: 'add_liquidity',
			args: { pool_id: id, amounts },
			amount: LP_STORAGE_AMOUNT,
		},
	];
	const needDeposit = await checkTokenNeedsStorageDeposit();
	if (needDeposit) {
		actions.unshift(
			storageDepositAction({
				amount: needDeposit,
			}),
		);
	}
	return refFiManyFunctionCalls(actions);
};

interface RemoveLiquidityOptions {
	id: number;
	shares: string;
	minimumAmounts: { [tokenId: string]: string };
}
export const removeLiquidityFromPool = async ({ id, shares, minimumAmounts }: RemoveLiquidityOptions) => {
	const pool = await getPool(id);

	const amounts = pool.tokenIds.map(tokenId => minimumAmounts[tokenId]);

	const actions: RefFiFunctionCallOptions[] = [
		{
			methodName: 'remove_liquidity',
			args: {
				pool_id: id,
				shares,
				min_amounts: amounts,
			},
			amount: ONE_YOCTO_NEAR,
		},
	];

	const needDeposit = await checkTokenNeedsStorageDeposit();
	if (needDeposit) {
		actions.unshift(
			storageDepositAction({
				amount: needDeposit,
			}),
		);
	}

	return refFiManyFunctionCalls(actions);
};

export const addSimpleLiquidityPool = async (tokenIds: string[], fee: number) => {
	const storageBalances = await Promise.all(tokenIds.map(id => ftGetStorageBalance(id, REF_FI_CONTRACT_ID)));

	const transactions: Transaction[] = storageBalances
		.reduce((acc, sb, i) => {
			if (!sb || sb.total === '0') acc.push(tokenIds[i] as never);
			return acc;
		}, [])
		.map(id => ({
			receiverId: id,
			functionCalls: [storageDepositForFTAction()],
		}));

	transactions.push({
		receiverId: REF_FI_CONTRACT_ID,
		functionCalls: [
			{
				methodName: 'add_simple_pool',
				args: { tokens: tokenIds, fee },
				amount: '0.05',
			},
		],
	});

	return executeMultipleTransactions(transactions, `${window.location.origin}/pools/add`);
};
