import MainProviderActionsInterface from '@ProviderPattern/Interfaces/MainProviderActionsInterface';
import AbstractMainProvider from '../AbstractMainProvider';
import AbstractMainMTokenProviderAction from './AbstractMainMTokenProviderAction';
import AbstractMainTokenProviderActions from './AbstractMainTokenProviderActions';
import AbstractMainVaultProviderActions from './AbstractMainVaultProviderActions';

export default class AbstractMainProviderActions implements MainProviderActionsInterface {
	private static _classInstanceSingleton: AbstractMainProviderActions;

	private declare _ProviderProtocolInstance: AbstractMainProvider;

	private declare _APIActionsInstance: object | undefined;

	private declare _AccountctionsInstance: object | undefined;

	private declare _FTContractActionsInstance: object | undefined;

	private declare _FarmActionsInstance: object | undefined;

	private declare _MTokenActionsInstance: AbstractMainMTokenProviderAction;

	private declare _PoolActionsInstance: object | undefined;

	private declare _SwapActionsInstance: object | undefined;

	private declare _TokenActionsInstance: AbstractMainTokenProviderActions;

	private declare _VaultActionsInstance: AbstractMainVaultProviderActions;

	private declare _TransactionActionsInstance: object | undefined;

	public static getInstance(providerProtocolInstance: AbstractMainProvider): AbstractMainProviderActions {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp(providerProtocolInstance);
		return this._classInstanceSingleton;
	}

	private setUp(providerProtocolInstance: AbstractMainProvider) {
		this._ProviderProtocolInstance = providerProtocolInstance;
		this._APIActionsInstance = undefined;
		this._AccountctionsInstance = undefined;
		this._FTContractActionsInstance = undefined;
		this._FarmActionsInstance = undefined;
		this._MTokenActionsInstance = AbstractMainMTokenProviderAction.getInstance(this);
		this._PoolActionsInstance = undefined;
		this._SwapActionsInstance = undefined;
		this._TokenActionsInstance = AbstractMainTokenProviderActions.getInstance(this);
		this._VaultActionsInstance = AbstractMainVaultProviderActions.getInstance(this);
		this._TransactionActionsInstance = undefined;
	}

	public getProviderProtocolInstance() {
		return this._ProviderProtocolInstance;
	}

	public getAPIActions() {
		return this._APIActionsInstance;
	}

	public getAccountActions() {
		return this._AccountctionsInstance;
	}

	public getFTContractActions() {
		return this._FTContractActionsInstance;
	}

	public getFarmActions() {
		return this._FarmActionsInstance;
	}

	public getMTokenActions() {
		return this._MTokenActionsInstance;
	}

	public getPoolActions() {
		return this._PoolActionsInstance;
	}

	public getSwapActions() {
		return this._SwapActionsInstance;
	}

	public getTokenActions() {
		return this._TokenActionsInstance;
	}

	public getVaultActions() {
		return this._VaultActionsInstance;
	}

	public getTransactionActions() {
		return this._TransactionActionsInstance;
	}
}
