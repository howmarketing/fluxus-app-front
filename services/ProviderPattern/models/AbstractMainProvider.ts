import { keyStores, Near } from 'near-api-js';
import { NearConfig } from 'near-api-js/lib/near';
import { MainProviderInterface, IMainProviderConfig } from '../Interfaces';
import AbstractMainWallet from './AbstractMainWallet';
import { IPROTOCOL_NAME, PROTOCOLS } from '../constants';
import AbstractMainProviderConfig from './AbstractMainProviderConfig';
import MainProviderActions from './Actions';

/**
 * //TODO: Define title
 *
 * @export
 * @class AbstractMainProvider
 * @typedef {AbstractMainProvider}
 * @implements {MainProviderInterface}
 */
export default class AbstractMainProvider implements MainProviderInterface {
	/**
	 * #### Protected Property protocolName from class AbstractMainProvider
	 *
	 * @public
	 * @type {IPROTOCOL_NAME}
	 */
	public protocolName: IPROTOCOL_NAME;

	/**
	 * #### Protected Property _classInstanceSingleton from class AbstractMainProvider
	 *
	 * @protected
	 * @static
	 * @type {(AbstractMainProvider | undefined)}
	 */
	protected static _classInstanceSingleton: AbstractMainProvider | undefined;

	/**
	 * #### Protected Property providerConnection from class AbstractMainProvider
	 *
	 * @protected
	 * @type {(undefined | Near | any)}
	 */
	protected declare providerConnection: undefined | Near | any;

	/**
	 * #### Protected Property providerConfig from class AbstractMainProvider
	 *
	 * @protected
	 * @type {(undefined | AbstractMainProviderConfig)}
	 */
	protected declare providerConfig: undefined | AbstractMainProviderConfig;

	/**
	 * #### Protected Property providerConfigData from class AbstractMainProvider
	 *
	 * @protected
	 * @type {(undefined | IMainProviderConfig)}
	 */
	protected declare providerConfigData: undefined | IMainProviderConfig;

	/**
	 * #### Protected Property providerWalletConnection from class AbstractMainProvider
	 *
	 * @protected
	 * @type {(AbstractMainWallet | undefined)}
	 */
	protected declare providerWalletConnection: AbstractMainWallet | undefined;

	/**
	 * #### Protected Property providerActions from class AbstractMainProvider
	 *
	 * @protected
	 * @type {(MainProviderActions | undefined)}
	 */
	protected declare providerActions: MainProviderActions | undefined;

	// Just exist for dev experience, will be removed on release version
	/**
	 * #### Protected Property providerMethodPropsTesting from class AbstractMainProvider
	 *
	 * @protected
	 * @type {*}
	 */
	protected declare providerMethodPropsTesting: any;

	/**
	 * Creates an instance of AbstractMainProvider.
	 *
	 * @constructor
	 */
	constructor() {
		this.protocolName = PROTOCOLS.NEAR;
		this.providerConnection = undefined;
		this.providerWalletConnection = undefined;
		this.providerConfig = undefined;
		this.providerConfigData = undefined;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @static
	 * @returns {AbstractMainProvider}
	 */
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

	/**
	 * Description placeholder
	 *
	 * @protected
	 */
	protected setUp() {
		this.setProviderConfig();
		this.setProviderConfigData();
	}

	/**
	 * Description placeholder
	 *
	 * @protected
	 */
	protected setProviderConfig() {
		this.providerConfig = AbstractMainProviderConfig.getInstance();
	}

	/**
	 * Description placeholder
	 *
	 * @protected
	 */
	protected setProviderConfigData() {
		this.providerConfigData = AbstractMainProviderConfig.getConfig();
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @returns {IMainProviderConfig}
	 */
	public getProviderConfigData(): IMainProviderConfig {
		if (!this.providerConfigData) {
			this.setProviderConfig();
			this.setProviderConfigData();
		}
		return AbstractMainProviderConfig.getConfig();
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @returns {*}
	 */
	public getProviderActions() {
		if (!this.providerActions) {
			this.providerActions = MainProviderActions.getInstance(this);
		}
		return this.providerActions;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {?(IMainProviderConfig | undefined)} [connectionConfig]
	 * @returns {this}
	 */
	public connect(connectionConfig?: IMainProviderConfig | undefined) {
		if (this.providerConnection && !connectionConfig) {
			return this;
		}
		const configAs = (connectionConfig || this.getProviderConfigData()) as unknown;
		const config = configAs as NearConfig; // Implement after
		this.providerConnection = new Near({ keyStore: new keyStores.BrowserLocalStorageKeyStore(), ...config });
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @template T extends any
	 * @param {?(IMainProviderConfig | undefined)} [connectionConfig]
	 * @returns {T}
	 */
	public getConnection<T extends any>(connectionConfig?: IMainProviderConfig | undefined): T {
		if (!this.providerConnection) {
			this.connect(connectionConfig);
		}
		return this.providerConnection as T;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @returns {IMainProviderConfig}
	 */
	public getConnectionConfigData(): IMainProviderConfig {
		return this.getConnection<Near>().config as IMainProviderConfig;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @returns {*}
	 */
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

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public deposit(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public withdraw(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public withdrawRewards(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public withdrawAllRewards(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public registerTokenAndExchange(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public registerToken(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public unregisterToken(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getTokenBalances(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getTokenBalance(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getAccountRegisteredTokens(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getWhitelistedTokens(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getContractWhitelistedTokens(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}

	/**
	 * Description placeholder
	 *
	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getContractWhitelistedTokensForAccount(props: { name: string; type: string }) {
		this.providerMethodPropsTesting = props;
		return this;
	}
}
