import MainProviderActionsInterface from '@ProviderPattern/Interfaces/MainProviderActionsInterface';
import AbstractMainAccountProviderAction from '@ProviderPattern/models/Actions/AbstractMainAccountProviderAction';
import AbstractMainProvider from '@ProviderPattern/models/AbstractMainProvider';
import AbstractMainMTokenProviderAction from '@ProviderPattern/models/Actions/AbstractMainMTokenProviderAction';
import AbstractMainTokenProviderActions from '@ProviderPattern/models/Actions/AbstractMainTokenProviderActions';
import AbstractMainVaultProviderActions from '@ProviderPattern/models/Actions/AbstractMainVaultProviderActions';
import AbstractMainFarmProviderAction from './AbstractMainFarmProviderAction';
import AbstractMainFTContractProviderAction from './AbstractMainFTContractProviderAction';
import AbstractMainPoolProviderAction from './AbstractMainPoolProviderAction';
import AbstractMainSwapProviderAction from './AbstractMainSwapProviderAction';
import AbstractMainProviderAPI from './AbstractMainProviderAPI';
import AbstractMainIndexerProviderAction from './AbstractMainIndexerProviderAction';

export default class AbstractMainProviderActions implements MainProviderActionsInterface {
	private static _classInstanceSingleton: AbstractMainProviderActions;

	private declare _ProviderProtocolInstance: AbstractMainProvider;

	private declare _APIActionsInstance: AbstractMainProviderAPI;

	private declare _IndexerActionsInstance: AbstractMainIndexerProviderAction;

	private declare _AccountActionsInstance: AbstractMainAccountProviderAction;

	private declare _FTContractActionsInstance: AbstractMainFTContractProviderAction;

	private declare _FarmActionsInstance: AbstractMainFarmProviderAction;

	private declare _MTokenActionsInstance: AbstractMainMTokenProviderAction;

	private declare _PoolActionsInstance: AbstractMainPoolProviderAction;

	private declare _SwapActionsInstance: AbstractMainSwapProviderAction;

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
		this._APIActionsInstance = AbstractMainProviderAPI.getInstance(this);
		this._IndexerActionsInstance = AbstractMainIndexerProviderAction.getInstance(this);
		this._AccountActionsInstance = AbstractMainAccountProviderAction.getInstance(this);
		this._FTContractActionsInstance = AbstractMainFTContractProviderAction.getInstance(this);
		this._FarmActionsInstance = AbstractMainFarmProviderAction.getInstance(this);
		this._MTokenActionsInstance = AbstractMainMTokenProviderAction.getInstance(this);
		this._PoolActionsInstance = AbstractMainPoolProviderAction.getInstance(this);
		this._SwapActionsInstance = AbstractMainSwapProviderAction.getInstance(this);
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

	public getIndexerActions() {
		return this._IndexerActionsInstance;
	}

	public getAccountActions() {
		return this._AccountActionsInstance;
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
