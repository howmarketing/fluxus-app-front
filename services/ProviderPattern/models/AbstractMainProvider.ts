import { keyStores, Near } from 'near-api-js';
import { NearConfig } from 'near-api-js/lib/near';
import { MainProviderInterface, IMainProviderConfig } from '../Interfaces';
import AbstractMainWallet from './AbstractMainWallet';
import { IPROTOCOL_NAME, PROTOCOLS } from '../constants';
import AbstractMainProviderConfig from './AbstractMainProviderConfig';
import MainProviderActions from './Actions';

export default class AbstractMainProvider implements MainProviderInterface {
	public protocolName: IPROTOCOL_NAME;

	protected static _classInstanceSingleton: AbstractMainProvider | undefined;

	protected declare providerConnection: undefined | Near | any;

	protected declare providerConfig: undefined | AbstractMainProviderConfig;

	protected declare providerConfigData: undefined | IMainProviderConfig;

	protected declare providerWalletConnection: AbstractMainWallet | undefined;

	protected declare providerActions: MainProviderActions | undefined;

	// Just exist for dev experience, will be removed on release version
	protected declare providerMethodPropsTesting: any;

	constructor() {
		this.protocolName = PROTOCOLS.NEAR;
		this.providerConnection = undefined;
		this.providerWalletConnection = undefined;
		this.providerConfig = undefined;
		this.providerConfigData = undefined;
	}

	public static getInstance(): AbstractMainProvider {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp();
		// Public method to set or change the connection config data, like exchange contract configuration or network endpoint.
		// this._classInstanceSingleton.connect();
		return this._classInstanceSingleton;
	}

	protected setUp() {
		this.setProviderConfig();
		this.setProviderConfigData();
	}

	protected setProviderConfig() {
		this.providerConfig = AbstractMainProviderConfig.getInstance();
	}

	protected setProviderConfigData() {
		this.providerConfigData = AbstractMainProviderConfig.getConfig();
	}

	public getProviderConfigData(): IMainProviderConfig {
		if (!this.providerConfigData) {
			this.setProviderConfig();
			this.setProviderConfigData();
		}
		return AbstractMainProviderConfig.getConfig();
	}

	public getProviderActions() {
		if (!this.providerActions) {
			this.providerActions = MainProviderActions.getInstance(this);
		}
		return this.providerActions;
	}

	public connect(connectionConfig?: IMainProviderConfig | undefined) {
		if (this.providerConnection && !connectionConfig) {
			return this;
		}
		const config = (connectionConfig || this.getProviderConfigData()) as NearConfig; // Implement after
		this.providerConnection = new Near({ keyStore: new keyStores.BrowserLocalStorageKeyStore(), ...config });
		return this;
	}

	public getConnection<T extends any>(connectionConfig?: IMainProviderConfig | undefined): T {
		if (!this.providerConnection) {
			this.connect(connectionConfig);
		}
		return this.providerConnection as T;
	}

	public getConnectionConfigData(): IMainProviderConfig {
		return this.getConnection<Near>().config as IMainProviderConfig;
	}

	public getWallet() {
		if (this.providerWalletConnection) {
			return this.providerWalletConnection;
		}
		this.providerWalletConnection = new AbstractMainWallet(
			this.getConnection<Near>(),
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
