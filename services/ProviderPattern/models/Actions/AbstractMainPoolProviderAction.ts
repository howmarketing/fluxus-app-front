/* eslint-disable camelcase */
import BN from 'bn.js';
import { TokenMetadata } from '@ProviderPattern/models/Actions/AbstractMainFTContractProviderAction';
import AbstractMainProviderActions from '@ProviderPattern/models/Actions/AbstractMainProviderActions';
import AbstractGenericActions from '@ProviderPattern/models/Actions/AbstractGenericActions';
import { PoolRPCView } from '@ProviderPattern/models/Actions/AbstractMainProviderAPI';
import ProviderPattern from '@ProviderPattern/index';
import {
	executeMultipleTransactions,
	LP_STORAGE_AMOUNT,
	ONE_YOCTO_NEAR,
	refFiViewFunction,
	REF_FI_CONTRACT_ID,
	Transaction,
	RefFiFunctionCallOptions,
	refFiManyFunctionCalls,
} from '../../../near';
import { toNonDivisibleNumber } from '../../../../utils/numbers';
import { storageDepositAction, storageDepositForFTAction } from '../../../creators/storage';

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

interface GetPoolOptions {
	tokenInId: string;
	tokenOutId: string;
	amountIn: string;
	setLoadingTrigger?: (loadingTrigger: boolean) => void;
	setLoadingData?: (loading: boolean) => void;
	loadingTrigger: boolean;
}

interface PoolVolumes {
	[tokenId: string]: { input: string; output: string };
}
export type PoolDetails = Pool & { volumes: PoolVolumes };

interface AddLiquidityToPoolOptions {
	id: number;
	tokenAmounts: { token: TokenMetadata; amount: string }[];
}

interface RemoveLiquidityOptions {
	id: number;
	shares: string;
	minimumAmounts: { [tokenId: string]: string };
}

export default class AbstractMainPoolProviderAction extends AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AbstractMainPoolProviderAction;

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
	 * GET THE ACCOUNT ACTIONS INSTACE
	 */
	protected getAccountActionsInstance() {
		return this.getProviderActionsInstace().getAccountActions();
	}

	/**
	 * GET THE VAULTS ACTIONS INSTACE
	 */
	protected getVaultsActionsInstance() {
		return this.getProviderActionsInstace().getVaultActions();
	}

	/**
	 * GET THE FT CONTRACT ACTIONS INSTACE
	 */
	protected getFTContractActionsInstance() {
		return this.getProviderActionsInstace().getFTContractActions();
	}

	public parsePool(pool: PoolRPCView, id?: number): Pool {
		this.devImplementation = true;
		return {
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
		};
	}

	public async getPools({
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
	}): Promise<Pool[]> {
		const poolData: PoolRPCView[] = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getIndexerActions()
			.getTopPools({
				page,
				perPage,
				tokenName,
				column,
				order,
				uniquePairName,
			});
		if (poolData.length > 0) {
			return poolData.map(rawPool => this.parsePool(rawPool));
		}
		return [];
	}

	public async getPoolsFromIndexer({
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
	}): Promise<Pool[]> {
		const poolData: PoolRPCView[] = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getIndexerActions()
			.getTopPools({
				page,
				perPage,
				tokenName,
				column,
				order,
				uniquePairName,
			});

		return poolData.map(rawPool => this.parsePool(rawPool));
	}

	public async getTotalPools() {
		this.devImplementation = true;
		return refFiViewFunction({
			methodName: 'get_number_of_pools',
		});
	}

	public async getAllPools(page: number = 1, perPage: number = DEFAULT_PAGE_LIMIT): Promise<Pool[]> {
		const index = (page - 1) * perPage;
		const poolData: PoolRPCView[] = await refFiViewFunction({
			methodName: 'get_pools',
			args: { from_index: index, limit: perPage },
		});

		return poolData.map((rawPool, i) => this.parsePool(rawPool, i + index));
	}

	public async getPoolsByTokens({
		tokenInId,
		tokenOutId,
		amountIn,
		setLoadingData,
		setLoadingTrigger,
		loadingTrigger,
	}: GetPoolOptions): Promise<Pool[]> {
		const amountToTrade = new BN(amountIn);
		let filtered_pools: Pool[] = [];

		if (typeof setLoadingData === 'function') {
			setLoadingData(true);
		}
		const totalPools = await this.getTotalPools();
		const pages = Math.ceil(totalPools / DEFAULT_PAGE_LIMIT);
		const pools = (await Promise.all([...Array(pages)].map((_, i) => this.getAllPools(i + 1)))).flat();

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
	}

	public async getPool(id: number): Promise<Pool> {
		return refFiViewFunction({
			methodName: 'get_pool',
			args: { pool_id: id },
		}).then((pool: PoolRPCView) => this.parsePool(pool, id));
	}

	public async getPoolDetails(id: number): Promise<PoolDetails> {
		const [pool, volumes] = await Promise.all([
			this.getPool(id),
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
	}

	public async getPoolVolumes(id: number): Promise<PoolVolumes> {
		return (await this.getPoolDetails(id)).volumes;
	}

	public async getSharesInPool({ pool_id = 0, accountId = this.getWallet().getAccountId() }): Promise<string> {
		const returnEmpty = async (): Promise<string> => '0';
		if (!this.getWallet().isSignedIn()) {
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
	}

	/**
	 * NOT IMPLEMENTED YET
	 */
	public async getRewards(id: number): Promise<string> {
		return refFiViewFunction({
			methodName: 'list_rewards',
			args: { account_id: this.getWallet().getAccountId() },
		});
	}

	/**
	 * NOT IMPLEMENTED YET
	 * @param {number} pool_id
	 * @param {boolean} withEnded
	 * @returns {Promise<number>} Return farm count for this pool
	 */
	public async canFarm(pool_id: number, withEnded?: boolean): Promise<Number> {
		this.devImplementation = true;
		return new Promise<Number>((resolve, reject) => {
			resolve(pool_id);
		});
	}

	public async addLiquidityToPool({ id, tokenAmounts }: AddLiquidityToPoolOptions) {
		const amounts = tokenAmounts.map(({ token, amount }) => toNonDivisibleNumber(token.decimals, amount));
		const actions: RefFiFunctionCallOptions[] = [
			{
				methodName: 'add_liquidity',
				args: { pool_id: id, amounts },
				amount: LP_STORAGE_AMOUNT,
			},
		];
		const needDeposit = await this.getTokenActionsInstance().checkTokenNeedsStorageDeposit();
		if (needDeposit) {
			actions.unshift(
				storageDepositAction({
					amount: needDeposit,
				}),
			);
		}
		return refFiManyFunctionCalls(actions);
	}

	public async removeLiquidityFromPool({ id, shares, minimumAmounts }: RemoveLiquidityOptions) {
		this.devImplementation = true;
		const pool = await this.getPool(id);
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
		const needDeposit = await this.getTokenActionsInstance().checkTokenNeedsStorageDeposit();
		if (needDeposit) {
			actions.unshift(
				storageDepositAction({
					amount: needDeposit,
				}),
			);
		}
		return refFiManyFunctionCalls(actions);
	}

	public async addSimpleLiquidityPool(tokenIds: string[], fee: number) {
		this.devImplementation = true;
		const storageBalances = await Promise.all(
			tokenIds.map(id => this.getFTContractActionsInstance().ftGetStorageBalance(id, REF_FI_CONTRACT_ID)),
		);

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
	}
}
