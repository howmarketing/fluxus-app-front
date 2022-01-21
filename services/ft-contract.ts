import metadataDefaults from '@utils/metadata';
import { storageDepositForFTAction } from './creators/storage';
import { RefFiFunctionCallOptions, getWallet, getGas, getAmount, RefFiViewFunctionOptions } from './near';

export const NEAR_ICON = 'https://near.org/wp-content/themes/near-19/assets/img/brand-icon.png';
const BANANA_ID = 'banana.ft-fin.testnet'; // 'berryclub.ek.near';
const CHEDDAR_ID = 'token.cheddar.near';
const CUCUMBER_ID = 'farm.berryclub.ek.near';
const HAPI_ID = 'd9c2d319cd7e6177336b0a9c93c21cb48d84fb54.factory.bridge.near';

export const ftFunctionCall = (tokenId: string, { methodName, args, gas, amount }: RefFiFunctionCallOptions) => {
	if (!getWallet().isSignedIn()) {
		return {} as any;
	}
	return getWallet()
		.account()
		.functionCall(tokenId, methodName, args, getGas(`${gas || ''}`), getAmount(`${amount || ''}`));
};

export const ftViewFunction = (tokenId: string, { methodName, args }: RefFiViewFunctionOptions) => {
	if (!getWallet().isSignedIn()) {
		// return {} as any;
	}
	return getWallet().account().viewFunction(tokenId, methodName, args);
};

export const ftGetBalance = (tokenId: string) =>
	ftViewFunction(tokenId, {
		methodName: 'ft_balance_of',
		args: { account_id: getWallet().getAccountId() },
	});

export interface FTStorageBalance {
	total: string;
	available: string;
}
export const ftGetStorageBalance = (
	tokenId: string,
	accountId: string = getWallet().getAccountId(),
): Promise<FTStorageBalance | null> =>
	ftViewFunction(tokenId, {
		methodName: 'storage_balance_of',
		args: { account_id: accountId },
	});

export interface TokenMetadata {
	id: string;
	name: string;
	symbol: string;
	decimals: number;
	icon: string;
	ref?: number;
	near?: number;
	total?: number;
	amountLabel?: string;
	amount?: number;
}
export const ftGetTokenMetadata = async (id: string, debug = false): Promise<TokenMetadata> => {
	try {
		if (!getWallet().isSignedIn()) {
			// return {} as TokenMetadata;
		}
		const metadata = (await ftViewFunction(id, {
			methodName: 'ft_metadata',
		})) as TokenMetadata;
		if (!metadata?.id) {
			metadata.id = id;
		}
		if (debug || process.env.DEBUG_LOG === 'true') {
			console.log('ftGetTokenMetadata: ', { id, metadata, defaultIcon: metadataDefaults[id] });
		}

		if (
			!metadata.icon ||
			metadata.icon === 'NOT_FOUNDED' ||
			metadata.icon === NEAR_ICON ||
			metadata.id === BANANA_ID ||
			metadata.id === CHEDDAR_ID ||
			metadata.id === CUCUMBER_ID ||
			metadata.id === HAPI_ID
		) {
			metadata.icon = metadataDefaults[id];
		}
		if (metadata.icon === 'NOT_FOUNDED') {
			metadata.icon = metadataDefaults.fluxus;
		}
		return {
			...metadata,
		};
	} catch (err: any) {
		// console.log('ftGetTokenMetadata:(error) ', { success: false, reward_token_id: id, msg: err.message });
		return {
			id,
			name: id,
			symbol: id?.split('.').splice(0, 1).join('').toLocaleUpperCase(),
			decimals: 18,
			icon: metadataDefaults.fluxus,
		};
	}
};

export const ftRegisterExchange = async (tokenId: string) => ftFunctionCall(tokenId, storageDepositForFTAction());
