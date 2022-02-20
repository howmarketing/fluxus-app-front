import { IMainProviderConfig } from '../Interfaces/index';

export default class AbstractMainProviderConfig {
	public static networkId: string | undefined = 'testnet';

	public static nodeUrl: string = 'https://rpc.testnet.near.org';

	public static walletUrl: string | undefined = 'https://wallet.testnet.near.org';

	public static helperUrl: string | undefined = 'https://helper.testnet.near.org';

	public static explorerUrl: string | undefined = 'https://explorer.testnet.near.org';

	public static indexerUrl: string | undefined = 'https://dev-indexer.ref-finance.com';

	public static sodakiApiUrl: string | undefined = 'https://sodaki.com/api';

	public static fluxusApiUrl: string | undefined = 'https://fluxus-api-v-vercel-tes-j91kga.herokuapp.com/graphql';

	public static REF_FI_CONTRACT_ID: string | undefined = process.env.REF_FI_CONTRACT_ID || 'exchange.ref-dev.testnet';

	public static FLUXUS_CONTRACT_ID: string | undefined =
		process.env.FLUXUS_CONTRACT_ID || 'exchange.leopollum.testnet';

	public static FLUXUS_VAULT_CONTRACT_ID: string | undefined =
		process.env.FLUXUS_VAULT_CONTRACT_ID || 'dev-1645186405351-30060585523052';

	public static REF_FARM_CONTRACT_ID: string | undefined =
		process.env.REF_FARM_CONTRACT_ID || 'farm110.ref-dev.testnet';

	public static FLUXUS_FARM_CONTRACT_ID: string = process.env.FLUXUS_FARM_CONTRACT_ID || 'farm.leopollum.testnet';

	public static WRAP_NEAR_CONTRACT_ID: string = process.env.WRAP_NEAR_CONTRACT_ID || 'wrap.testnet';

	public static REF_ADBOARD_CONTRACT_ID: string = 'ref-adboard.near';

	public static REF_TOKEN_ID: string = process.env.REF_TOKEN_ID || 'token.ref-finance.testnet';

	public static FLUXUS_TOKEN_ID: string = process.env.FLUXUS_TOKEN_ID || 'exchange.leopollum.testnet';

	public static REF_AIRDROP_CONTRACT_ID: string = 'locker002.ref-dev.testnet';

	public static POOL_TOKEN_REFRESH_INTERVAL: string | number = Number(
		process.env.POOL_TOKEN_REFRESH_INTERVAL || '10',
	);

	protected static _classInstanceSingleton: AbstractMainProviderConfig;

	protected declare MainProviderConfig: IMainProviderConfig;

	private constructor() {
		this.MainProviderConfig = AbstractMainProviderConfig.getConfig();
	}

	public static getInstance(): AbstractMainProviderConfig {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new AbstractMainProviderConfig();
		return this._classInstanceSingleton;
	}

	public static getConfig(): IMainProviderConfig {
		return {
			networkId: AbstractMainProviderConfig.networkId || '',
			nodeUrl: AbstractMainProviderConfig.nodeUrl || '',
			walletUrl: AbstractMainProviderConfig.walletUrl || '',
			helperUrl: AbstractMainProviderConfig.helperUrl || '',
			explorerUrl: AbstractMainProviderConfig.explorerUrl || '',
			indexerUrl: AbstractMainProviderConfig.indexerUrl || '',
			sodakiApiUrl: AbstractMainProviderConfig.sodakiApiUrl || '',
			fluxusApiUrl: AbstractMainProviderConfig.fluxusApiUrl || '',
			REF_FI_CONTRACT_ID: AbstractMainProviderConfig.REF_FI_CONTRACT_ID || '',
			FLUXUS_CONTRACT_ID: AbstractMainProviderConfig.FLUXUS_CONTRACT_ID || '',
			FLUXUS_VAULT_CONTRACT_ID: AbstractMainProviderConfig.FLUXUS_VAULT_CONTRACT_ID || '',
			REF_FARM_CONTRACT_ID: AbstractMainProviderConfig.REF_FARM_CONTRACT_ID || '',
			FLUXUS_FARM_CONTRACT_ID: AbstractMainProviderConfig.FLUXUS_FARM_CONTRACT_ID || '',
			WRAP_NEAR_CONTRACT_ID: AbstractMainProviderConfig.WRAP_NEAR_CONTRACT_ID || '',
			REF_ADBOARD_CONTRACT_ID: AbstractMainProviderConfig.REF_ADBOARD_CONTRACT_ID || '',
			REF_TOKEN_ID: AbstractMainProviderConfig.REF_TOKEN_ID || '',
			FLUXUS_TOKEN_ID: AbstractMainProviderConfig.FLUXUS_TOKEN_ID || '',
			REF_AIRDROP_CONTRACT_ID: AbstractMainProviderConfig.REF_AIRDROP_CONTRACT_ID || '',
			POOL_TOKEN_REFRESH_INTERVAL: AbstractMainProviderConfig.POOL_TOKEN_REFRESH_INTERVAL || '',
		};
	}

	public static getNetworkId(): string | undefined {
		return this.networkId;
	}

	public static getNodeUrl(): string | undefined {
		return this.nodeUrl;
	}

	public static getWalletUrl(): string | undefined {
		return this.walletUrl;
	}

	public static getHelperUrl(): string | undefined {
		return this.helperUrl;
	}

	public static getExplorerUrl(): string | undefined {
		return this.explorerUrl;
	}

	public static getIndexerUrl(): string | undefined {
		return this.indexerUrl;
	}

	public static getSodakiApiUrl(): string | undefined {
		return this.sodakiApiUrl;
	}

	public static getFluxusApiUrl(): string | undefined {
		return this.fluxusApiUrl;
	}

	public static getRefContractId(): string | undefined {
		return this.REF_FI_CONTRACT_ID;
	}

	public static getFluxusContractId(): string | undefined {
		return this.FLUXUS_CONTRACT_ID;
	}

	public static getFluxusVaultContractId(): string | undefined {
		return this.FLUXUS_VAULT_CONTRACT_ID;
	}

	public static getRefFarmContractId(): string | undefined {
		return this.REF_FARM_CONTRACT_ID;
	}

	public static getFluxusFarmContractId(): string | undefined {
		return this.FLUXUS_FARM_CONTRACT_ID;
	}

	public static getWrapNearContractId(): string | undefined {
		return this.WRAP_NEAR_CONTRACT_ID;
	}

	public static getRefAdboardContractId(): string | undefined {
		return this.REF_ADBOARD_CONTRACT_ID;
	}

	public static getRefTokenId(): string | undefined {
		return this.REF_TOKEN_ID;
	}

	public static getFluxusTokenId(): string | undefined {
		return this.FLUXUS_TOKEN_ID;
	}

	public static getRefAirDropContractId(): string | undefined {
		return this.REF_AIRDROP_CONTRACT_ID;
	}

	public static getPoolTokenRefreshInterval(): string | number {
		return this.POOL_TOKEN_REFRESH_INTERVAL;
	}
}
