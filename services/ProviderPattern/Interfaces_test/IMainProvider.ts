/* eslint-disable max-classes-per-file */
import { IMainProviderConfig, IPROTOCOL_NAME, IMainWallet } from '@ProviderPattern/Interfaces_test/';
import { AMainProvider } from '@ProviderPattern/Abstract/';
import { IProviderActionsManager } from '@ProviderPattern/Interfaces_test/IProviderActionsManager';
import { IAny } from '@ProviderPattern/Interfaces_test/types';
import AbstractMainWalletAccount from '@ProviderPattern/models/AbstractMainWallet';
import ProviderActionsManager from '@ProviderPattern/models/Actions/AbstractMainProviderActions';

// TODO: Remove if not need to be implemented
// import { AGenericSingleton } from '@ProviderPattern/Abstract/AGenericSingleton';

// TODO: Remove if not need to be implemented
// import { Transaction } from 'near-api-js/lib/transaction';

// TODO: Remove if not need to be implemented
// import { AbstractMainWallet } from '@ProviderPattern/models';

// TODO: Remove if not need to be implemented
// import { ProviderActionsManager } from '@ProviderPattern/models/Actions/ProviderActionsManager';

// TODO: Remove if not need to be implemented
// import { AbstractMainWallet } from '@ProviderPattern/models/AbstractMainWallet';

// TODO After models and actions implements, this have to be correctly implemented
// import { ProviderActionsManager } from '@ProviderPattern/models/Actions';

// CODE REVIEW FROM HERE
/**
 *
 *
 * @export
 * @interface IMainProvider
 * @extends {AMainProvider}
 * @template IMPLEMENTED
 */
export interface IMainProvider<IMPLEMENTED = unknown> extends AMainProvider {
	/**
	 * THIS SHOULD BE IMPLEMENTED WITH THE NAME OF PROVIDER
	 */
	protocolName: IPROTOCOL_NAME;

	/**
	 * #### Description placeholder
	 *
	 * @param {?(IMainProviderConfig | undefined)} [connectionConfig]
	 * @returns {IMainProvider}
	 */
	connect(connectionConfig?: IMainProviderConfig | undefined): IMainProvider;

	/**
	 * #### Description placeholder
	 *
	 * @template T
	 * @param {?(IMainProviderConfig | undefined)} [connectionConfig]
	 * @returns {T}
	 */
	getConnection<T extends IAny = IAny>(connectionConfig?: IMainProviderConfig | undefined): T;
	/**
	 * RETURN AN OBJECT CONTAINING ALL PROVIDER CONFIG FOR HIS CONNECTION
	 */
	getProviderConfigData(): IMainProviderConfig;

	/**
	 * RETURN AN OBJECT CONTAINING ALL PROVIDER CONFIG IN CURRENT CONNECTION
	 * @description
	 * 	It is almost the same as the getProviderConfigData, but the difference between the both, is that this one, return the current config data
	 * 		-	it means that, even if the provider was configured with defaults config data, it may have been modified thought your life cycle usages, what could be different about redefined values
	 */
	getConnectionConfigData(): IMainProviderConfig;

	/**
	 * #DEV
	 * TODO - WHILE IN DEVELOPMENT PROCESS, THIS SHOULD KEEP TO EASY RELEASE AFTER BE TESTED
	 *
	 * GET THE PROVIDER ACTIONS CLASS INSTANCE
	 */
	getProviderActions(): ProviderActionsManager;

	/**
	 * GET THE INSTANCE REFERENCE FOR PROVIDER WALLET INSTANCE
	 */
	getWallet(): AbstractMainWalletAccount; // TODO Change for AbstractMainWallet when it exist

	/**
	 * DO ALL deposit ACTIONS WITH CURRENT PROVIDER INSTANCE
	 */
	deposit(...args: any[]): Promise<any>;

	/**
	 * DO ALL WITHDRAW ACTIONS WITH CURRENT PROVIDER INSTANCE
	 */
	withdraw(...args: any[]): Promise<any>;

	/**
	 * DO ALL IDENTIFIED REWARDS WITHDRAW ACTIONS WITH CURRENT PROVIDER INSTANCE
	 */
	withdrawRewards(...args: any[]): Promise<any>;

	/**
	 * DO ALL REWARDS WITHDRAW ACTIONS WITH CURRENT PROVIDER INSTANCE
	 */
	withdrawAllRewards(...args: any[]): Promise<any>;

	/**
	 * DO ALL REGISTER TOKEN ACTIONS WITH CURRENT PROVIDER INSTANCE
	 */
	registerToken(...args: any[]): Promise<any>;

	/**
	 * DO ALL UNREGISTER TOKEN ACTIONS WITH CURRENT PROVIDER INSTANCE
	 */
	unregisterToken(...args: any[]): Promise<any>;

	/**
	 * DO ALL REGISTER TOKEN AND EXCHANGE ACTIONS WITH CURRENT PROVIDER INSTANCE
	 */
	registerTokenAndExchange(...args: any[]): Promise<any>;

	/**
	 * GET TOKEN BALANCES THROUGH ACTIONS INSTANCE FOR THE CURRENT PROVIDER INSTANCE
	 */
	getTokenBalances(...args: any[]): Promise<any>;

	/**
	 *  GET TOKEN BALANCE THROUGH ACTIONS INSTANCE FOR THE CURRENT PROVIDER INSTANCE
	 */
	getTokenBalance(...args: any[]): Promise<any>;

	/**
	 *  GET THE ACCOUNT REGISTERED TOKENS THROUGH ACTIONS INSTANCE FOR THE CURRENT PROVIDER INSTANCE
	 */
	getAccountRegisteredTokens(...args: any[]): Promise<any>;

	/**
	 * GET THE ACCOUNT WHITELIST TOKENS THROUGH ACTIONS INSTANCE FOR THE CURRENT PROVIDER INSTANCE
	 */
	getWhitelistedTokens(...args: any[]): Promise<any>;

	/**
	 * GET THE CONTRACT WHITELIST TOKENS THROUGH ACTIONS INSTANCE FOR THE CURRENT PROVIDER INSTANCE
	 */
	getContractWhitelistedTokens(...args: any[]): Promise<any>;

	/**
	 * GET THE CONTRACT WHITELIST TOKENS FOR ACCOUNT THROUGH ACTIONS INSTANCE FOR THE CURRENT PROVIDER INSTANCE
	 */
	getWhitelistForAccount(...args: any[]): Promise<any>;
}
