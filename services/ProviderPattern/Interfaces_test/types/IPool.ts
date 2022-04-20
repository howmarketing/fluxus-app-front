import { ITokenMetadata } from '@ProviderPattern/Interfaces_test/types';

/**
 * ### Type IPoolVolumes from Pool types
 *
 * @export
 * @typedef {IPoolVolumes}
 */
export type IPoolVolumes = {
	[tokenId: string]: { input: string; output: string };
};

/**
 * ### Type IPool from Pool types
 *
 * @export
 * @typedef {IPool}
 */
export type IPool = {
	id: number;
	tokenIds: Array<string>;
	supplies: { [key: string]: string };
	fee: number;
	shareSupply: string;
	tvl: number;
	token0RefPrice: string;
	amounts?: Array<string> | undefined;
	amp?: number | undefined;
	farming?: boolean | undefined;
	poolKind?: string | undefined;
	sharesTotalSupply?: string | undefined;
	tokenAccountIds?: Array<string> | undefined;
	tokenSymbols?: Array<string> | undefined;
	totalFee?: number | undefined;
};
/**
 * ### Type IPoolDetails from Pool types
 *
 * @export
 * @typedef {IPoolDetails}
 */
export type IPoolDetails = IPool & { volumes: IPoolVolumes };

/**
 * ### Type IPoolLiterals from Pool types
 *
 * @export
 * @typedef {IPoolLiterals}
 */
export type IPoolLiterals = keyof IPool;

/**
 * ### Type IRewardsInfo from Pool types
 *
 * @export
 * @typedef {IRewardsInfo}
 */
export type IRewardsInfo = Record<string, string>;

/**
 * ### Type IGetPoolOptions from Pool types
 *
 * @export
 * @typedef {IGetPoolOptions}
 */
export type IGetPoolOptions = {
	tokenInId: string;
	tokenOutId: string;
	amountIn: string;
	setLoadingTrigger?: (loadingTrigger: boolean) => void;
	setLoadingData?: (loading: boolean) => void;
	loadingTrigger: boolean;
};

/**
 * ### Type IAddLiquidityToPoolOptions from Pool types
 *
 * @export
 * @typedef {IAddLiquidityToPoolOptions}
 */
export type IAddLiquidityToPoolOptions = {
	id: number;
	tokenAmounts: Array<{ token: ITokenMetadata; amount: string }>;
};

/**
 * ### Type IRemoveLiquidityOptions from Pool types
 *
 * @export
 * @typedef {IRemoveLiquidityOptions}
 */
export type IRemoveLiquidityOptions = {
	id: number;
	shares: string;
	minimumAmounts: { [tokenId: string]: string };
};

/**
 * ### Type IPoolRPCView from Pool types
 *
 * @export
 * @typedef {IPoolRPCView}
 */
export type IPoolRPCView = {
	id: number;
	tokenAccountIds: Array<string>;
	tokenSymbols: Array<string>;
	amounts: Array<string>;
	totalFee: number;
	sharesTotalSupply: string;
	tvl: number;
	token0RefPrice: string;
	share: string;
};

/**
 * Description placeholder
 *
 * @export
 * @typedef {IPoolVol}
 */
export type IPoolVol = {
	input: string;
	output: string;
};

/**
 * Description placeholder
 *
 * @export
 * @typedef {IPoolTop}
 */
export type IPoolTop = {
	amounts: string[];
	amp: number;
	farming: boolean;
	id: string;
	poolKind: string;
	sharesTotalSupply: string;
	token0RefPrice: string;
	tokenAccountIds: string[];
	tokenSymbols: string[];
	totalFee: number;
	tvl: string;
	vol01: IPoolVol;
	vol10: IPoolVol;
	share: string;
};

/**
 * ### Type IPoolHistoryFiatPrice from Pool types
 *
 * @export
 * @typedef {IPoolHistoryFiatPrice}
 */
export type IPoolHistoryFiatPrice = {
	poolId: string;
	assetAmount: string;
	fiatAmount: string;
	assetPrice: string;
	fiatPrice: string;
	assetTvl: string;
	fiatTvl: string;
	date: string;
};

/**
 * ### Type IPoolFiatPrice from Pool types
 *
 * @export
 * @typedef {IPoolFiatPrice}
 */
export type IPoolFiatPrice = {
	amounts: Array<string>;
	amp: number;
	farming: boolean;
	id: number;
	poolKind: string;
	sharesTotalSupply: string;
	token0RefPrice: string;
	tokenAccountIds: Array<string>;
	tokenSymbols: Array<string>;
	totalFee: number;
	tvl: number;
	shareSupply: unknown;
};

/**
 * ### Type IEstimateSwapOptions from Pool types
 *
 * @export
 * @typedef {IEstimateSwapOptions}
 */
export type IEstimateSwapOptions = {
	tokenIn: ITokenMetadata;
	tokenOut: ITokenMetadata;
	amountIn: string;
	intl?: unknown;
	setLoadingData?: (loading: boolean) => void;
	setLoadingTrigger?: (loadingTrigger: boolean) => void;
	loadingTrigger?: boolean;
};

/**
 * ### Type IEstimateSwapView from Pool types
 *
 * @export
 * @typedef {IEstimateSwapView}
 */
export type IEstimateSwapView = {
	estimate: string;
	pool: IPool;
	intl?: unknown;
};

/**
 * ### Type ISwapOptions from Pool types
 *
 * @export
 * @typedef {ISwapOptions}
 */
export type ISwapOptions = {
	pool: IPool;
	minAmountOut: string;
} & IEstimateSwapOptions;

/**
 * ### Type IInstantSwapOption from Pool types
 *
 * @export
 * @typedef {IInstantSwapOption}
 */
export type IInstantSwapOption = {
	useNearBalance: boolean;
} & ISwapOptions;
