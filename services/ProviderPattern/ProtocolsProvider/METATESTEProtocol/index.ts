import { IPROTOCOL_NAME, PROTOCOLS } from '@ProviderPattern/constants';
import { IMainProviderConfig } from '@ProviderPattern/Interfaces';
import AbstractMainProvider from '@ProviderPattern/models/AbstractMainProvider';
import Web3 from 'web3';
import { AbstractProvider } from 'web3-core/types/index';
import MetaTesteWallet from './models/MetaTesteWallet';

export type IAbstractProviderEth = AbstractProvider;

export default class METATESTEProtocolProvider extends AbstractMainProvider {
	public declare protocolName: IPROTOCOL_NAME;

	protected declare providerConnection: undefined | Web3;

	protected static _classInstanceSingleton: METATESTEProtocolProvider | undefined;

	private constructor() {
		super();
		this.protocolName = PROTOCOLS.METATESTE;
	}

	public static getInstance(): METATESTEProtocolProvider {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp();
		return this._classInstanceSingleton;
	}

	public connect(connectionConfig?: IMainProviderConfig | undefined) {
		if (this.providerConnection && !connectionConfig) {
			return this;
		}
		this.providerConnection = this._getConnect(connectionConfig);
		return this;
	}

	private _getConnect(connectionConfig?: IMainProviderConfig | undefined): Web3 {
		if (this.providerConnection && !connectionConfig) {
			return this.providerConnection;
		}
		// const config = (connectionConfig || this.getProviderConfigData()) as NearConfig; // Implement after
		// const web3HrrpProvider = new Web3.providers.HttpProvider('https://testnet.aurora.dev');
		const provider = new Web3('https://testnet.aurora.dev:443');
		return provider;
	}

	public getConnection<T extends any>(connectionConfig?: IMainProviderConfig | undefined): T {
		if (!this.providerConnection) {
			this.connect(connectionConfig);
		}
		const connection = this._getConnect();
		return connection as T;
	}

	public getGivenProvider(): AbstractProvider {
		return this.getConnection<Web3>().eth.givenProvider;
	}

	public getRequestAccountsResponse() {
		return this.getGivenProvider()?.request({ method: 'eth_requestAccounts' });
	}

	public getEthWallet() {
		return this.getConnection<Web3>().eth.accounts.wallet;
	}

	public getConnectionConfigData(): IMainProviderConfig {
		return this.getConnectionConfigData() as IMainProviderConfig;
	}

	public getWallet() {
		if (this.providerWalletConnection) {
			return this.providerWalletConnection;
		}
		this.providerWalletConnection = new MetaTesteWallet(
			this.getConnection(),
			this.providerConfigData?.REF_FI_CONTRACT_ID || '',
		);
		return this.providerWalletConnection;
	}

	public deposit(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public withdraw(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public withdrawRewards(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public withdrawAllRewards(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public registerTokenAndExchange(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public registerToken(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public unregisterToken(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public getTokenBalances(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public getTokenBalance(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public getAccountRegisteredTokens(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public getWhitelistedTokens(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public getContractWhitelistedTokens(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	public getContractWhitelistedTokensForAccount(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}
}
