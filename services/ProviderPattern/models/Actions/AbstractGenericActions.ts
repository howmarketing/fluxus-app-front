import ProviderPattern from '@services/ProviderPattern';
import { IMainProviderConfig } from '@ProviderPattern/Interfaces';
import { Near } from 'near-api-js';
import AbstractMainProviderActions from './AbstractMainProviderActions';

export default class AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AbstractGenericActions;

	protected declare _providerActionsInstace: AbstractMainProviderActions;

	public static getInstance(providerActionsInstance: AbstractMainProviderActions) {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp(providerActionsInstance);
		return this._classInstanceSingleton;
	}

	protected setUp(providerActionsInstance: AbstractMainProviderActions) {
		this._providerActionsInstace = providerActionsInstance;
	}

	protected getConnection(connectionConfig?: IMainProviderConfig | undefined) {
		return this._providerActionsInstace.getProviderProtocolInstance().getConnection(connectionConfig);
	}

	protected getConnectionConfigData() {
		return this._providerActionsInstace.getProviderProtocolInstance().getConnection<Near>()
			.config as IMainProviderConfig;
	}

	protected getProviderConfigData() {
		return this._providerActionsInstace.getProviderProtocolInstance().getProviderConfigData();
	}

	protected getWallet() {
		return this._providerActionsInstace.getProviderProtocolInstance().getWallet();
	}
}
