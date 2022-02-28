import ProviderPattern from '@ProviderPattern/index';
import { IMainProviderConfig } from '@ProviderPattern/Interfaces';

export default function getConfig(env: string = 'testnet'): IMainProviderConfig {
	try {
		const config = ProviderPattern.getInstance(undefined).getProvider().getProviderConfigData();
		return config;
	} catch (e) {
		return {} as IMainProviderConfig;
	}
}
/**
 * DEV ONLY: Anotations to easy consulting the old return to fast tests, what still in progress, so keep while implementing the Provider Pattern interfaces
 * - OLD RETURN FROM GETCONFIG FUNCTION:
* 	- {
			networkId: 'testnet',
			nodeUrl: 'https://rpc.testnet.near.org',
			walletUrl: 'https://wallet.testnet.near.org',
			helperUrl: 'https://helper.testnet.near.org',
			explorerUrl: 'https://explorer.testnet.near.org',
			indexerUrl: 'https://dev-indexer.ref-finance.com',
			sodakiApiUrl: 'https://sodaki.com/api',
			REF_FI_CONTRACT_ID: process.env.REF_FI_CONTRACT_ID || 'exchange.ref-dev.testnet',
			FLUXUS_CONTRACT_ID: process.env.FLUXUS_CONTRACT_ID || 'exchange.leopollum.testnet', // ****************************
			FLUXUS_VAULT_CONTRACT_ID: process.env.FLUXUS_VAULT_CONTRACT_ID || 'dev-1645186405351-30060585523052', // ****************************
			REF_FARM_CONTRACT_ID: process.env.REF_FARM_CONTRACT_ID || 'farm110.ref-dev.testnet',
			FLUXUS_FARM_CONTRACT_ID: process.env.FLUXUS_FARM_CONTRACT_ID || 'farm.leopollum.testnet', // ****************************
			WRAP_NEAR_CONTRACT_ID: process.env.WRAP_NEAR_CONTRACT_ID || 'wrap.testnet',
			REF_ADBOARD_CONTRACT_ID: 'ref-adboard.near',

			REF_TOKEN_ID: process.env.REF_TOKEN_ID || 'token.ref-finance.testnet',
			FLUXUS_TOKEN_ID: process.env.FLUXUS_TOKEN_ID || 'exchange.leopollum.testnet', // ****************************

			REF_AIRDROP_CONTRACT_ID: 'locker002.ref-dev.testnet',
			POOL_TOKEN_REFRESH_INTERVAL: process.env.POOL_TOKEN_REFRESH_INTERVAL || 10,
		};
 */
