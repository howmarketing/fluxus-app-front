import * as math from 'mathjs';
import { BigNumber } from 'bignumber.js';
import { toPrecision, toReadableNumber } from '@utils/numbers';
import { LP_TOKEN_DECIMALS } from '@ProviderPattern/models/Actions/AbstractMainMTokenProviderAction';
import { TokenMetadata } from '@ProviderPattern/models/Actions/AbstractMainFTContractProviderAction';
import { PoolRPCView } from '@ProviderPattern/models/Actions/AbstractMainProviderAPI';
import AbstractMainProviderActions from '@ProviderPattern/models/Actions/AbstractMainProviderActions';
import AbstractGenericActions from '@ProviderPattern/models/Actions/AbstractGenericActions';
import ProviderPattern from '@ProviderPattern/index';
import { storageDepositAction, STORAGE_TO_REGISTER_WITH_MFT } from '@creators/storage';
import {
	refFarmFunctionCall,
	refFarmViewFunction,
	Transaction,
	executeFarmMultipleTransactions,
} from '@ProviderPattern/services/near';

export const DEFAULT_PAGE_LIMIT = 100;

export type PoolVolumes = {
	[tokenId: string]: { input: string; output: string };
};

export interface Pool {
	shareSupply: string;
	amounts: string[];
	amp: number;
	farming: boolean;
	id: number;
	pool_kind: string;
	shares_total_supply: string;
	token0_ref_price: string;
	token_account_ids: string[];
	token_symbols: string[];
	total_fee: number;
	tvl: number;
}
export type PoolDetails = Pool & { volumes: PoolVolumes };

export type IRewardsInfo = Record<string, string>;

export type IFarmData = {
	farm_id: string;
	farm_kind: string;
	farm_status: string;
	seed_id: string;
	reward_token: string;
	token_details: TokenMetadata;
	user_reward: any;
	user_unclaimed_reward: any;
	start_at: number;
	reward_per_session: number;
	session_interval: number;
	total_reward: number;
	cur_round: number;
	last_round: number;
	claimed_reward: number;
	unclaimed_reward: number;
	beneficiary_reward: number | string | undefined;
};

export type IGetFarmsResponse = Array<IFarmData>;

export type ISeedInfo = {
	seed_id: string;
	seed_type: string;
	farms: string[];
	next_index: number;
	amount: string;
	min_deposit: string;
};

export type IUserListRewards = Record<string, string>;
/* - */

export interface Seed {
	seed_id: string;
	amount: number;
}

export interface Farm {
	farm_id: string;
	farm_kind: string;
	farm_status: string;
	seed_id: string;
	reward_token: string;
	start_at: number;
	reward_per_session: number;
	session_interval: number;
	total_reward: number;
	cur_round: number;
	last_round: number;
	claimed_reward: number;
	unclaimed_reward: number;
	current_user_reward?: number | string | undefined;
	beneficiary_reward?: number | string | undefined;
}

export interface FarmInfo extends Farm {
	pool: PoolRPCView;
	lpTokenId: string;
	rewardNumber: string;
	userStaked: string;
	rewardsPerWeek: string;
	userRewardsPerWeek: string;
	userUnclaimedReward: string;
	rewardToken: TokenMetadata;
	totalStaked: number;
	apr: string;
	tokenIds: string[];
	show?: boolean;
	seedAmount: string;
}

export default class AbstractMainFarmProviderAction extends AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AbstractMainFarmProviderAction;

	protected declare _providerActionsInstace: AbstractMainProviderActions;

	public defaultPageLimit: number = 100;

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

	public async getSeeds({
		page = 1,
		perPage = DEFAULT_PAGE_LIMIT,
		useFluxusFarmContract = false,
	}: {
		page?: number;
		perPage?: number;
		useFluxusFarmContract?: boolean;
	}): Promise<Record<string, string>> {
		this.devImplementation = true;
		const index = (page - 1) * perPage;
		const seedDatas = await refFarmViewFunction({
			methodName: 'list_seeds',
			args: { from_index: index, limit: perPage },
			useFluxusFarmContract,
		});
		return seedDatas;
	}

	public async listFarms({
		page = 1,
		perPage = this.defaultPageLimit,
		useFluxusFarmContract = false,
	}: {
		page?: number;
		perPage?: number;
		useFluxusFarmContract?: boolean;
	}): Promise<Array<Farm>> {
		this.devImplementation = true;
		const index = (page - 1) * perPage;
		const seedDatas = await refFarmViewFunction({
			methodName: 'list_farms',
			args: { from_index: index, limit: perPage },
			useFluxusFarmContract,
		});

		return seedDatas;
	}

	/**
	 *
	 */
	public async getListSeedsInfo({
		page = 1,
		limit = this.defaultPageLimit,
		useFluxusFarmContract = false,
	}): Promise<Record<string, ISeedInfo>> {
		const index = (page - 1) * limit;
		return refFarmViewFunction({
			methodName: 'list_seeds_info',
			args: { from_index: index, limit },
			useFluxusFarmContract,
		});
	}

	public async getSeedInfo({ seed_id = '', useFluxusFarmContract = false }): Promise<ISeedInfo> {
		this.devImplementation = true;
		return refFarmViewFunction({
			methodName: 'get_seed_info',
			args: { seed_id },
			useFluxusFarmContract,
		});
	}

	public async getStakedListByAccountId({
		accountId = this.getWallet().getAccountId(),
		useFluxusFarmContract = false,
	}): Promise<IFarmData> {
		this.devImplementation = true;
		if (!accountId) {
			return {} as IFarmData;
		}
		const params = {
			methodName: 'list_user_seeds',
			args: { account_id: accountId },
			useFluxusFarmContract,
		};
		const stakedList = await refFarmViewFunction(params);

		return stakedList;
	}

	public getLPTokenId(farm_id: string) {
		this.devImplementation = true;
		return farm_id.slice(farm_id.indexOf('@') + 1, farm_id.lastIndexOf('#'));
	}

	public async getFarms({
		page = 1,
		perPage = DEFAULT_PAGE_LIMIT,
		stakedList,
		rewardList,
		tokenPriceList,
		seeds,
	}: {
		page?: number;
		perPage?: number;
		stakedList: Record<string, string>;
		rewardList: Record<string, string>;
		tokenPriceList: any;
		seeds: Record<string, string>;
	}): Promise<FarmInfo[]> {
		this.devImplementation = true;
		const index = (page - 1) * perPage;
		const farms: Farm[] = await refFarmViewFunction({
			methodName: 'list_farms',
			args: { from_index: index, limit: perPage },
		});
		const pool_ids = farms.map(f => this.getLPTokenId(f.farm_id));

		let poolList: Record<string, PoolRPCView> = {};
		const pools = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getIndexerActions()
			.getPoolsByIds({ pool_ids });
		if (pools) {
			poolList = pools.reduce((obj: any, pool: PoolRPCView) => ({ ...obj, [pool.id]: pool }), {});
		}

		const tasks = farms.map(async f => {
			const pool: PoolRPCView =
				Object.keys(poolList).length === 0
					? {
							id: 0,
							token_account_ids: ['', ''],
							token_symbols: ['', ''],
							amounts: ['', ''],
							total_fee: 0,
							shares_total_supply: '0',
							tvl: 0,
							token0_ref_price: '0',
							share: '0',
					  }
					: poolList[this.getLPTokenId(f.farm_id)];

			const fi: FarmInfo = await this.getFarmInfo(
				f,
				pool,
				stakedList[f.seed_id],
				tokenPriceList,
				rewardList[f.reward_token],
				seeds[f.seed_id],
				this.getLPTokenId(f.farm_id),
			);
			return fi;
		});

		return Promise.all(tasks);
	}

	public async getFarmInfo(
		farm: Farm,
		pool: PoolRPCView,
		staked: string,
		tokenPriceList: any,
		reward: string,
		seed: string,
		lpTokenId: string,
	): Promise<FarmInfo> {
		this.devImplementation = true;
		const isSignedIn: boolean = this.getWallet().isSignedIn();
		const { shares_total_supply, tvl, token_account_ids } = pool;
		const poolTvl = tvl;
		const poolSts = Number(toReadableNumber(24, shares_total_supply));
		const userStaked = toReadableNumber(LP_TOKEN_DECIMALS, staked ?? '0');
		const rewardToken = await this.getProviderActions()
			.getFTContractActions()
			.ftGetTokenMetadata(farm.reward_token);
		const rewardTokenPrice = tokenPriceList ? tokenPriceList[rewardToken.id]?.price || 0 : 0;
		const rewardNumber = toReadableNumber(rewardToken.decimals, reward) ?? '0';
		const seedAmount = seed ?? '0';
		const totalSeed = toReadableNumber(LP_TOKEN_DECIMALS, seedAmount);

		const rewardNumberPerWeek = math.round(
			math.evaluate(`(${farm.reward_per_session} / ${farm.session_interval}) * 604800`),
		);

		const rewardsPerWeek = toPrecision(
			toReadableNumber(rewardToken.decimals, new BigNumber(rewardNumberPerWeek.toString()).toFixed()),
			0,
		);

		const userRewardNumberPerWeek =
			seedAmount !== '0'
				? math.round(math.evaluate(`${rewardNumberPerWeek} * (${staked ?? 0} / ${seedAmount})`))
				: 0;

		const userRewardsPerWeek = toReadableNumber(rewardToken.decimals, userRewardNumberPerWeek.toString());

		const userUnclaimedRewardNumber: string = isSignedIn ? await this.getUnclaimedReward(farm.farm_id) : '0';
		const userUnclaimedReward = toReadableNumber(rewardToken.decimals, userUnclaimedRewardNumber);

		const totalStaked =
			poolSts === 0 ? 0 : Number(toPrecision(((Number(totalSeed) * poolTvl) / poolSts).toString(), 1));

		const apr =
			totalStaked === 0
				? '0'
				: toPrecision(
						((1 / totalStaked) * (Number(rewardsPerWeek) * Number(rewardTokenPrice)) * 52 * 100).toString(),
						2,
				  );

		if (farm.farm_status === 'Created') farm.farm_status = 'Pending';

		return {
			...farm,
			pool,
			lpTokenId,
			rewardNumber,
			userStaked,
			rewardsPerWeek,
			userRewardsPerWeek,
			userUnclaimedReward,
			rewardToken,
			totalStaked,
			apr,
			tokenIds: token_account_ids,
			seedAmount,
		};
	}

	public async getUnclaimedFarms({
		page = 1,
		perPage = DEFAULT_PAGE_LIMIT,
		stakedList,
		rewardList,
		tokenPriceList,
		seeds,
	}: {
		page?: number;
		perPage?: number;
		stakedList: Record<string, string>;
		rewardList: Record<string, string>;
		tokenPriceList: any;
		seeds: Record<string, string>;
	}): Promise<FarmInfo[]> {
		this.devImplementation = true;
		const isSignedIn = this.getWallet().isSignedIn();
		const farms: FarmInfo[] = await this.getFarms({
			page,
			perPage,
			stakedList,
			rewardList,
			tokenPriceList,
			seeds,
		});
		await Promise.all(
			farms.map(async (farm: any, i: number) => {
				const current_user_reward = isSignedIn ? await this.getUnclaimedReward(farm.farm_id) : 0;
				farms[i].current_user_reward = current_user_reward;
			}),
		);

		return farms.filter(farm => Number(farm.current_user_reward) > 0);
	}

	public async getFarmsBySeedId(seed_id: number | string): Promise<Farm[]> {
		this.devImplementation = true;
		const farms: Farm[] = await refFarmViewFunction({
			methodName: 'list_farms_by_seed',
			args: { seed_id },
		});

		return farms;
	}

	public async getFarm(id: number): Promise<Farm> {
		this.devImplementation = true;
		return refFarmViewFunction({
			methodName: 'get_farm',
			args: { farm_id: id },
		});
	}

	public async getRewards({
		accountId = this.getWallet().getAccountId(),
		useFluxusFarmContract = false,
	}): Promise<IUserListRewards> {
		this.devImplementation = true;
		return refFarmViewFunction({
			methodName: 'list_rewards',
			args: { account_id: accountId },
			useFluxusFarmContract,
		});
	}

	public async getRewardByTokenId(
		token_id: string,
		accountId = this.getWallet().getAccountId(),
		useFluxusFarmContract = false,
	): Promise<any> {
		this.devImplementation = true;
		if (!this.getWallet().isSignedIn()) {
			return `${10 ** 18}`.substring(2);
		}
		return refFarmViewFunction({
			methodName: 'get_reward',
			args: { account_id: accountId, token_id },
			useFluxusFarmContract,
		});
	}

	public async getUnclaimedReward(
		farm_id: string,
		accountId = this.getWallet().getAccountId(),
		useFluxusFarmContract = false,
	): Promise<any> {
		this.devImplementation = true;
		if (!this.getWallet().isSignedIn()) {
			return `${10 ** 18}`.substring(2);
		}
		const params = {
			methodName: 'get_unclaimed_reward',
			args: { account_id: accountId, farm_id },
			useFluxusFarmContract,
		};
		return refFarmViewFunction(params);
	}

	public async listRewards(accountId = this.getWallet().getAccountId(), useFluxusFarmContract = false): Promise<any> {
		this.devImplementation = true;
		return refFarmViewFunction({
			methodName: 'list_rewards',
			args: { account_id: accountId },
			useFluxusFarmContract,
		});
	}

	public async claimRewardByFarm(farm_id: string): Promise<any> {
		this.devImplementation = true;
		return refFarmFunctionCall({
			methodName: 'claim_reward_by_farm',
			args: { farm_id },
		});
	}

	public async claimRewardBySeed(seed_id: string, useFluxusFarmContract = false): Promise<any> {
		this.devImplementation = true;
		return refFarmFunctionCall({
			methodName: 'claim_reward_by_seed',
			args: { seed_id },
			useFluxusFarmContract,
		});
	}

	public async getAllSinglePriceByTokenIds(token_ids: string): Promise<any> {
		this.devImplementation = true;
		return ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getAPIActions()
			.currentTokensPrice(token_ids);
	}

	public async claimAndWithDrawReward(farmsData: any[]): Promise<any> {
		this.devImplementation = true;
		const token_ids: string[] = [];
		const transactions: Transaction[] = [];
		const ftBalanceListPromise: any[] = [];
		farmsData.forEach(farm => {
			const { userUnclaimedReward, rewardToken } = farm;
			if (Number(userUnclaimedReward) > 0) {
				token_ids.push(rewardToken.id);
			}
		});
		token_ids.forEach(tokenId => {
			ftBalanceListPromise.push(
				ProviderPattern.getInstance()
					.getProvider()
					.getProviderActions()
					.getFTContractActions()
					.ftGetStorageBalance(tokenId),
			);
		});
		const ftBalanceList = await Promise.all(ftBalanceListPromise);
		ftBalanceList.forEach((balance, index) => {
			if (!balance || balance.total === '0') {
				transactions.unshift({
					receiverId: token_ids[index],
					functionCalls: [
						storageDepositAction({
							registrationOnly: true,
							amount: STORAGE_TO_REGISTER_WITH_MFT,
						}),
					],
				});
			}
		});
		if (farmsData.length > 1) {
			transactions.push({
				receiverId: this.getProviderConfigData().REF_FARM_CONTRACT_ID,
				functionCalls: [
					{
						methodName: 'claim_and_withdraw_by_seed',
						args: { seed_id: farmsData[0].seed_id },
					},
				],
			});
		} else {
			transactions.push({
				receiverId: this.getProviderConfigData().REF_FARM_CONTRACT_ID,
				functionCalls: [
					{
						methodName: 'claim_and_withdraw_by_farm',
						args: {
							farm_id: farmsData[0].farm_id,
							withdraw_all_tokens: true,
						},
					},
				],
			});
		}
		return executeFarmMultipleTransactions(transactions);
	}
}
