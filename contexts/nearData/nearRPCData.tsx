import React, { createContext, useMemo } from 'react';
import type { NextPage } from 'next';
import { getNear, getWallet } from '@services/near';
import {
	config,
	// getTotalPools,
	// getPools,
	// getPoolDetails,
	// getUserDeposits,
	// getFarms,
	getListRewardsInfo,
	// getListSeedsInfo,
	// getSeedInfo,
	// getListFarmsBySeed,
	// getContractCode,
	// getUserListRewards,
	getListUserSeeds,
	getUserUnclaimedReward,
	// withdrawUserRewards,
	claimUserRewardsBySeed,
	// stakeFarmLPTokens,
} from '@workers/workerNearPresets';
import { Near } from 'near-api-js';
import AbstractMainWallet from '@ProviderPattern/models/AbstractMainWallet';

export type IPools = {
	total: number | string | undefined;
	list: Array<Record<any, any>>;
};

export type INearRPCContext = {
	config: typeof config;
	near: Near;
	getWallet: () => AbstractMainWallet;
	getNearPresets(): {
		near_connection: Near;
		// get_list_seeds_info: typeof getListSeedsInfo;
		// get_seed_info: typeof getSeedInfo;
		// get_list_farms_by_seed: typeof getListFarmsBySeed;
		// get_user_list_rewards: typeof getUserListRewards;
		// get_user_list_deposits: typeof getUserDeposits;
		// stake_farm_lp_Tokens: typeof stakeFarmLPTokens;
		get_user_unclaimed_rewards: typeof getUserUnclaimedReward;
		claime_user_rewards_by_seed: typeof claimUserRewardsBySeed;
		// withdraw_user_rewards: typeof withdrawUserRewards;
		get_user_list_seeds: typeof getListUserSeeds;
		// get_farms: typeof getFarms;
		get_list_rewards_info: typeof getListRewardsInfo;
		// get_pools: typeof getPools;
		// get_total_pools: typeof getTotalPools;
		// get_pool_details: typeof getPoolDetails;
		// get_contract_code: typeof getContractCode;
	};
};

export const nearRPCContext = createContext<INearRPCContext>({} as INearRPCContext);

export const NearRPCProvider: NextPage = function ({ children }) {
	const getNearPresets = () => ({
		near_connection: getNear(),
		// get_list_seeds_info: getListSeedsInfo,
		// get_seed_info: getSeedInfo,
		// get_list_farms_by_seed: getListFarmsBySeed,
		// get_user_list_rewards: getUserListRewards,
		// get_user_list_deposits: getUserDeposits,
		get_user_unclaimed_rewards: getUserUnclaimedReward,
		// stake_farm_lp_Tokens: stakeFarmLPTokens,
		claime_user_rewards_by_seed: claimUserRewardsBySeed,
		// withdraw_user_rewards: withdrawUserRewards,
		get_user_list_seeds: getListUserSeeds,
		// get_farms: getFarms,
		get_list_rewards_info: getListRewardsInfo,
		// get_pools: getPools,
		// get_total_pools: getTotalPools,
		// get_pool_details: getPoolDetails,
		// get_contract_code: getContractCode,
	});

	const nearRPCContextProviderValues = useMemo(
		() => ({
			config,
			near: getNear(),
			getWallet,
			getNearPresets,
		}),
		[],
	);

	return <nearRPCContext.Provider value={nearRPCContextProviderValues}>{children}</nearRPCContext.Provider>;
};
