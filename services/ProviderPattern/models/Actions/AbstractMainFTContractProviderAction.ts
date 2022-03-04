import metadataDefaults from '@utils/metadata';
import AbstractMainProviderActions from '@ProviderPattern/models/Actions/AbstractMainProviderActions';
import AbstractGenericActions from '@ProviderPattern/models/Actions/AbstractGenericActions';
import { storageDepositForFTAction } from '@creators/storage';
import {
	RefFiFunctionCallOptions,
	getWallet,
	getGas,
	getAmount,
	RefFiViewFunctionOptions,
} from '@ProviderPattern/services/near';

export const NEAR_ICON = 'https://near.org/wp-content/themes/near-19/assets/img/brand-icon.png';
const BANANA_ID = 'banana.ft-fin.testnet'; // 'berryclub.ek.near';
const CHEDDAR_ID = 'token.cheddar.near';
const CUCUMBER_ID = 'farm.berryclub.ek.near';
const HAPI_ID = 'd9c2d319cd7e6177336b0a9c93c21cb48d84fb54.factory.bridge.near';

export interface FTStorageBalance {
	total: string;
	available: string;
}
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
export default class AbstractMainFTContractProviderAction extends AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AbstractMainFTContractProviderAction;

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

	public ftFunctionCall(tokenId: string, { methodName, args, gas, amount }: RefFiFunctionCallOptions) {
		if (!this.getWallet().isSignedIn()) {
			return {} as any;
		}
		return getWallet()
			.account()
			.functionCall(tokenId, methodName, args, getGas(`${gas || ''}`), getAmount(`${amount || ''}`));
	}

	public ftViewFunction(tokenId: string, { methodName, args }: RefFiViewFunctionOptions) {
		if (!this.getWallet().isSignedIn()) {
			// return {} as any;
		}
		return getWallet().account().viewFunction(tokenId, methodName, args);
	}

	public ftGetBalance(tokenId: string) {
		this.devImplementation = true;
		return this.ftViewFunction(tokenId, {
			methodName: 'ft_balance_of',
			args: { account_id: getWallet().getAccountId() },
		});
	}

	public ftGetStorageBalance(
		tokenId: string,
		accountId: string = getWallet().getAccountId(),
	): Promise<FTStorageBalance | null> {
		return this.ftViewFunction(tokenId, {
			methodName: 'storage_balance_of',
			args: { account_id: accountId },
		});
	}

	public async ftGetTokenMetadata(id: string, debug = false): Promise<TokenMetadata> {
		this.devImplementation = true;
		try {
			if (!getWallet().isSignedIn()) {
				// return {} as TokenMetadata;
			}
			const metadata = (await this.ftViewFunction(id, {
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
	}

	public async ftRegisterExchange(tokenId: string) {
		return this.ftFunctionCall(tokenId, storageDepositForFTAction());
	}
}
