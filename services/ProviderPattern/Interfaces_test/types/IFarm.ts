import BN from 'bn.js';
import {
	ITokenMetadata,
	IPoolRPCView,
	IAction,
	IPublicKey,
} from '@ProviderPattern/Interfaces_test/types';

/**
 * ### Type for IFarm from Farm types
 *
 * @export
 * @typedef {IFarm}
 */
export type IFarm = {
	farmId: string;
	farmKind: string;
	farmStatus: string;
	seedId: string;
	rewardToken: string;
	startAt: number;
	rewardPerSession: number;
	sessionInterval: number;
	totalReward: number;
	curRound: number;
	lastRound: number;
	claimedReward: number;
	unclaimedReward: number;
};

/**
 * ### Type for IFarmData from Farm types
 *
 * @export
 * @typedef {IFarmData}
 */
export type IFarmData = IFarm & {
	tokenDetails?: ITokenMetadata;
	userReward?: string;
	userUnclaimedReward?: string;
};

/**
 * ### Type for IFarmInfo from Farm types
 *
 * @export
 * @typedef {IFarmInfo}
 */
export type IFarmInfo = {
	farmId: string;
	lpTokenId: string;
	pool: IPoolRPCView;
	rewardNumber: string;
	userStaked: string;
	rewardsPerWeek: string;
	userRewardsPerWeek: string;
	userUnclaimedReward: string;
	rewardToken: ITokenMetadata;
	totalStaked: number;
	apr: string;
	tokenIds: Array<string>;
	seedAmount: string;
	show?: boolean;
	farmKind: string;
	farmStatus: string;
	seedId: string;
	startAt: number;
	rewardPerSession: number;
	sessionInterval: number;
	totalReward: number;
	curRound: number;
	lastRound: number;
	claimedReward: number;
	unclaimedReward: number;
};

/**
 * ### Type for IGetFarmsResponse from Farm types
 *
 * @export
 * @typedef {IGetFarmsResponse}
 */
export type IGetFarmsResponse = Array<IFarmData>;

/**
 * ### Type for IWithdrawOptions from Farm types
 *
 * @export
 * @typedef {IWithdrawOptions}
 */
export type IWithdrawOptions = {
	tokenId: string;
	amount: string;
	token: ITokenMetadata;
	unregister?: boolean;
	useFluxusFarmContract?: boolean;
};

/**
 * ### Type for IStakeOptions from Farm types
 *
 * @export
 * @typedef {IStakeOptions}
 */
export type IStakeOptions = {
	tokenId: string;
	amount: string;
	msg?: string;
	useFluxusFarmContract?: boolean;
};

/**
 * ### Type for IUnstakeOptions from Farm types
 *
 * @export
 * @typedef {IUnstakeOptions}
 */
export type IUnstakeOptions = {
	seedId: string;
	amount: string;
	msg?: string;
};

/**
 * ### Type for IStake from Farm types
 *
 * @export
 * @typedef {IStake}
 */
export type IStake = IAction & {
	stake: BN;

	publicKey: IPublicKey;
};
