import { Near } from 'near-api-js';
import MainProviderConfigModel from '@ProviderPattern/models/AbstractMainProviderConfig';
import AbstractMainWallet from '@ProviderPattern/models/AbstractMainWallet';
import ProviderActionsManager from '@ProviderPattern/models/Actions/AbstractMainProviderActions';
import { AGenericSingleton } from '@ProviderPattern/Abstract';
import {
	IPROTOCOL_NAME,
	IMainProvider,
	IMainProviderConfig,
	IGenericSingletonClass,
	IAny,
} from '@ProviderPattern/Interfaces_test';

import ProviderPattern from '@ProviderPattern/index';

export abstract class AMainProvider extends AGenericSingleton {
	/**
	 *
	 * #ABSTRACT SUPPRESSOR DEFAULT
	 *
	 */

	/**
	 * @default
	 * This is the instance reference as singleton when requested
	 */
	protected static _singletonHandler: AMainProvider;

	/**
	 * @new
	 * #### Property protocolName as one of the literals protocols names IPROTOCOL_NAME (PROTOCOLS.NEAR)
	 *
	 * @public
	 * @type {IPROTOCOL_NAME}
	 */
	declare protocolName: IPROTOCOL_NAME;

	/**
	 * @default
	 * //TODO: Define Near
	 * This is the provider connection instance
	 */
	protected declare providerConnection: Near | IGenericSingletonClass<AMainProvider>;

	/**
	 * @default
	 * //TODO: remove possible type undefined
	 * #DEV
	 * //TODO -  CHANGE FOR INTERFACE REFERENCE
	 */
	protected declare providerConfig: MainProviderConfigModel;

	/**
	 * @default
	 * //TODO: remove possible undefined type
	 * With interface IMainProviderConfig implemented, this is the configuration data for provider connection.
	 */
	protected declare providerConfigData: IMainProviderConfig;

	/**
	 * @default
	 * * //TODO: remove possible undefined type
	 * #DEV
	 * //TODO -  CHANGE FOR INTERFACE REFERENCE
	 *
	 * This is the instance reference for wallet usage for provider instance
	 */
	protected declare providerWalletConnection: AbstractMainWallet;

	/**
	 * @default
	 * #DEV
	 * //TODO -  CHANGED FOR INTERFACE REFERENCE
	 *
	 * This is the instance of provider actions implemented him interface reference
	 */
	protected declare providerActions: ProviderActionsManager;

	/**
	 * @default
	 * #DEV
	 * //TODO - WHILE IN DEVELOPMENT PROCESS, THIS SHOULD KEEP TO EASY RELEASE AFTER BE TESTED
	 */
	protected declare providerMethodPropsTesting: IAny;

	/**
	 * //TODO: Apply to default
	 * #DEV - IN TEST PROGRESS
	 */
	static {
		this.getInstance = <T = InstanceType<typeof AMainProvider>>(): T => {
			const $this = this.getInstance<AMainProvider>();
			$this.setUp();
			return $this as unknown as T;
		};
	}

	/**
	 * To create the instance, the set up of this must to be present here.
	 */
	protected setUp(): void {
		this.setProviderConfig();
		this.setProviderConfigData();
	}

	/**
	 * Define the "providerConfig" property with the instance of provider config class
	 */
	protected setProviderConfig(): void {
		this.providerConfig = MainProviderConfigModel.getInstance();
	}

	/**
	 * Define the "providerConfigData" property with an object containing all provider config for his connection
	 */
	protected setProviderConfigData() {
		this.providerConfigData = MainProviderConfigModel.getConfig();
	}

	public getProviderConfigData(): IMainProviderConfig {
		if (!this.providerConfigData) {
			this.setProviderConfig();
			this.setProviderConfigData();
		}
		return MainProviderConfigModel.getConfig();
	}

	public getProviderActions() {
		if (!this.providerActions) {
			this.providerActions = ProviderActionsManager.getInstance(ProviderPattern.getProviderInstance());
		}
		return this.providerActions;
	}

	/**
	 * #### Description placeholder
	 * @param {?(IMainProviderConfig | undefined)} [connectionConfig]
	 */
	public abstract connect(connectionConfig?: IMainProviderConfig | undefined): IMainProvider;

	/**
	 * //TODO: Add title
	 * #### title
	 *
	 * @public
	 * @template T
	 * @param {?(IMainProviderConfig | undefined)} [connectionConfig]
	 * @returns {T}
	 */
	public getConnection<
		T extends Near | IGenericSingletonClass<AMainProvider> = Near | IGenericSingletonClass<AMainProvider>,
	>(connectionConfig?: IMainProviderConfig | undefined): T {
		if (!this.providerConnection) {
			this.connect(connectionConfig);
		}
		return this.providerConnection as T;
	}

	/**
	 * #### Property ): asIMainProviderConfig {
	 *
	 * @public
	 * @returns {IMainProviderConfig}
	 */
	public getConnectionConfigData(): IMainProviderConfig {
		return this.getConnection<Near>().config as IMainProviderConfig;
	}

	/**
	 * #### Property ) as{holder
	 *
	 * @public
	 * @returns {*}
	 */
	public getWallet(): AbstractMainWallet {
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
	 * #### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public deposit(props: { receiverId: string; amount: number | string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 */
	public withdraw(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public withdrawRewards(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public withdrawAllRewards(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public registerTokenAndExchange(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public registerToken(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public unregisterToken(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getTokenBalances(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getTokenBalance(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getAccountRegisteredTokens(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getWhitelistedTokens(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getContractWhitelistedTokens(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}

	/**
	 * Description placeholder
	 *#### Property props: { asname: string; type: string }) {	 * @public
	 * @param {{ name: string; type: string }} props
	 * @returns {this}
	 */
	public getWhitelistForAccount(props: { name: string; type: string }): Promise<any> {
		this.providerMethodPropsTesting = props;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(
					ProviderPattern.getProviderInstance().withdrawRewards({
						name: '',
						type: 's',
					}),
				);
			}, 1000);
		});
	}
}
