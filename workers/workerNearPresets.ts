/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
import { getNear, getWallet } from '@services/near';
import { TokenMetadata } from '@ProviderPattern/models/Actions/AbstractMainFTContractProviderAction';
import { BlockReference, CallFunctionRequest } from 'near-api-js/lib/providers/provider';
import ProviderPattern from '@ProviderPattern/index';
import { Farm } from '@ProviderPattern/models/Actions/AbstractMainFarmProviderAction';

export const config = ProviderPattern.getInstance().getProvider().getProviderConfigData();

const DEFAULT_PAGE_LIMIT = 100;

const view = ({
	methodName,
	args = {},
	useFluxusFarmContract = false,
}: {
	methodName: string;
	args?: object;
	useFluxusFarmContract?: boolean;
}) =>
	getNear()
		.connection.provider.query({
			request_type: 'call_function',
			finality: 'final',
			account_id: useFluxusFarmContract ? config.FLUXUS_CONTRACT_ID : config.REF_FI_CONTRACT_ID,
			method_name: methodName,
			args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
		})
		.then(res => {
			const indexResult = 'result' as any;
			return JSON.parse(Buffer.from(res[indexResult]).toString());
		});

const farmView = ({
	methodName,
	args = {},
	useFluxusFarmContract = false,
}: {
	methodName: string;
	args?: object;
	useFluxusFarmContract?: boolean;
}) => {
	const contractAccountID = useFluxusFarmContract ? config.FLUXUS_FARM_CONTRACT_ID : config.REF_FARM_CONTRACT_ID;
	const queryProps = {
		request_type: 'call_function',
		finality: 'final',
		account_id: contractAccountID,
		method_name: methodName,
		args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
	} as CallFunctionRequest & BlockReference;
	try {
		const result = getNear()
			.connection.provider.query(queryProps)
			.then(res => {
				const indexResult = 'result' as any;
				return JSON.parse(Buffer.from(res[indexResult]).toString());
			});
		return result;
	} catch (e: any) {
		// Error log
		console.log('WorkerNearPresets->farmView:error', `${e?.message || 'unknown error'}`);
		console.log('Query Props: ', { ...queryProps, args });
		console.error(e);
		return null;
	}
};

export const getContractCode = async (useFluxusFarmContract = false) => {
	const response = await getNear().connection.provider.query({
		request_type: 'view_code',
		finality: 'final',
		account_id: useFluxusFarmContract ? config.FLUXUS_CONTRACT_ID : config.REF_FI_CONTRACT_ID,
	});
	return response;
};

export type IRewardsInfo = Record<string, string>;
/**
 * @description Return all reward tokens from farm contract id
 * @param {number} page Página da listagem
 * @returns {Promise<IRewardsInfo>}
 */
export const getListRewardsInfo = async (page: number, useFluxusFarmContract = false): Promise<IRewardsInfo> => {
	const index = (page - 1) * DEFAULT_PAGE_LIMIT;
	return farmView({
		methodName: 'list_rewards_info',
		args: { from_index: index, limit: DEFAULT_PAGE_LIMIT },
		useFluxusFarmContract,
	});
};

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
export const getFarms = async (page: number, useFluxusFarmContract = false): Promise<IGetFarmsResponse> => {
	const index = (page - 1) * DEFAULT_PAGE_LIMIT;

	return farmView({
		methodName: 'list_farms',
		args: { from_index: index, limit: DEFAULT_PAGE_LIMIT },
		useFluxusFarmContract,
	});
};

export type ISeedInfo = {
	seed_id: string;
	seed_type: string;
	farms: string[];
	next_index: number;
	amount: string;
	min_deposit: string;
};

/**
 *
 * @param {number} page Page number, starting from 1 to total_pages=(total_seeds / 100) for seeds.
 * @returns {Record<string, ISeedInfo>} ISeedInfo type definition
 */
export const getListSeedsInfo = async (
	page: number,
	useFluxusFarmContract = false,
): Promise<Record<string, ISeedInfo>> =>
	ProviderPattern.getProviderInstance()
		.getProviderActions()
		.getFarmActions()
		.getListSeedsInfo({ page, limit: 100, useFluxusFarmContract });

export const getSeedInfo = async (seedID: string, useFluxusFarmContract = false): Promise<ISeedInfo> =>
	ProviderPattern.getInstance()
		.getProvider()
		.getProviderActions()
		.getFarmActions()
		.getSeedInfo({ seed_id: seedID, useFluxusFarmContract });

export const getListFarmsBySeed = async (seedID: string): Promise<Farm[]> =>
	ProviderPattern.getInstance().getProvider().getProviderActions().getFarmActions().getFarmsBySeedId(seedID);

export const getUserDeposits = async (accountID = getWallet().getAccountId()): Promise<any> =>
	ProviderPattern.getInstance()
		.getProvider()
		.getProviderActions()
		.getTokenActions()
		.getTokenBalances({ account_id: accountID });

export type IUserListRewards = Record<string, string>;
export const getUserListRewards = async (
	accountID?: string | undefined,
	useFluxusFarmContract?: boolean | undefined,
): Promise<IUserListRewards> => {
	const useAccountID =
		accountID || (getWallet().isSignedIn() ? getWallet().getAccountId() : config.REF_FARM_CONTRACT_ID);
	return ProviderPattern.getProviderInstance().getProviderActions().getFarmActions().getRewards({
		accountId: useAccountID,
		useFluxusFarmContract,
	});
};
export const stakeFarmLPTokens = async ({ token_id = '', amount = '', msg = '', useFluxusFarmContract = false }) =>
	ProviderPattern.getProviderInstance().getProviderActions().getMTokenActions().stake({
		token_id,
		amount,
		msg,
		useFluxusFarmContract,
	});
export const getUserUnclaimedReward = async ({
	accountID = getWallet().isSignedIn() ? getWallet().getAccountId() : config.REF_FARM_CONTRACT_ID,
	farmID = 'fluxus-farm-contract.testnet@seed_id#token_id',
}): Promise<IFarmData> =>
	farmView({
		methodName: 'get_unclaimed_reward',
		args: {
			account_id: accountID,
			farm_id: farmID,
		},
	});

export const withdrawUserRewards = async (
	checkedList: Record<string, any>,
	unregister?: boolean,
	useFluxusFarmContract?: boolean,
): Promise<void> =>
	ProviderPattern.getInstance()
		.getProvider()
		.getProviderActions()
		.getMTokenActions()
		.withdrawAllReward(checkedList, unregister, useFluxusFarmContract);

export const getListUserSeeds = async ({
	accountID = getWallet().isSignedIn() ? getWallet().getAccountId() : config.REF_FARM_CONTRACT_ID,
	useFluxusFarmContract = false,
}): Promise<IFarmData> =>
	ProviderPattern.getInstance().getProvider().getProviderActions().getFarmActions().getStakedListByAccountId({
		accountId: accountID,
		useFluxusFarmContract,
	});

export const claimUserRewardsBySeed = async (seed_id: string, useFluxusFarmContract = false): Promise<any> => {
	const claimed = await ProviderPattern.getInstance()
		.getProvider()
		.getProviderActions()
		.getFarmActions()
		.claimRewardBySeed(seed_id, useFluxusFarmContract)
		.catch((err: any) => {
			console.log('claimAllFarmedRewardTokens:(error) ', err?.message || 'unknown error');
			// alert('Claim Rewards by seed Failed');
		});
	return claimed;
};
