import { IPROTOCOL_NAME } from '../constants';

export interface MainProviderInterface {
	protocolName: IPROTOCOL_NAME;
	connect(data?: any): any;

	getWallet(data?: any): any;

	deposit(data?: any): any;

	withdraw(data?: any): any;

	withdrawRewards(data?: any): any;

	withdrawAllRewards(data?: any): any;

	registerTokenAndExchange(data?: any): any;

	registerToken(data?: any): any;

	unregisterToken(data?: any): any;

	getTokenBalances(data?: any): any;

	getTokenBalance(data?: any): any;

	getAccountRegisteredTokens(data?: any): any;

	getWhitelistedTokens(data?: any): any;

	getContractWhitelistedTokens(data?: any): any;

	getContractWhitelistedTokensForAccount(data?: any): any;
}
