import MainProviderActionsInterface from '@ProviderPattern/Interfaces/MainProviderActionsInterface';
import AbstractMainAccountProviderAction from '@ProviderPattern/models/Actions/AbstractMainAccountProviderAction';
import AbstractMainProvider from '@ProviderPattern/models/AbstractMainProvider';
import AbstractMainMTokenProviderAction from '@ProviderPattern/models/Actions/AbstractMainMTokenProviderAction';
import AbstractMainTokenProviderActions from '@ProviderPattern/models/Actions/AbstractMainTokenProviderActions';
import AbstractMainVaultProviderActions from '@ProviderPattern/models/Actions/AbstractMainVaultProviderActions';
import AbstractMainFarmProviderAction from '@ProviderPattern/models/Actions/AbstractMainFarmProviderAction';
import AbstractMainFTContractProviderAction from '@ProviderPattern/models/Actions/AbstractMainFTContractProviderAction';
import AbstractMainPoolProviderAction from '@ProviderPattern/models/Actions/AbstractMainPoolProviderAction';
import AbstractMainSwapProviderAction from '@ProviderPattern/models/Actions/AbstractMainSwapProviderAction';
import AbstractMainProviderAPI from '@ProviderPattern/models/Actions/AbstractMainProviderAPI';
import AbstractMainIndexerProviderAction from '@ProviderPattern/models/Actions/AbstractMainIndexerProviderAction';
import AbstractMainWrapNearProviderAction from '@ProviderPattern/models/Actions/AbstractMainWrapNearProviderAction';
import AbstractMainTransactionProviderAction from '@ProviderPattern/models/Actions/AbstractMainTransactionProviderAction';

/**
 * MANAGE THE AVAILABLE ACTIONS FOR PROVIDER
 * 		-	AbstractMainProvider
 * 		-	AbstractMainProviderAPI
 * 		-	AbstractMainIndexerProviderAction
 * 		-	AbstractMainAccountProviderAction
 * 		-	AbstractMainFTContractProviderAction
 * 		-	AbstractMainFarmProviderAction
 * 		-	AbstractMainMTokenProviderAction
 * 		-	AbstractMainPoolProviderAction
 * 		-	AbstractMainTokenProviderActions
 * 		-	AbstractMainVaultProviderActions
 * 		-	AbstractMainWrapNearProviderAction
 * 		-	AbstractMainTransactionProviderAction
 */
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

	private declare _WrapNearActionsInstance: AbstractMainWrapNearProviderAction;

	private declare _TransactionActionsInstance: AbstractMainTransactionProviderAction;

	/**
	 * GET THE SINGLETON INSTANCE FOR THIS MANAGER OF ACTIONS
	 */
	public static getInstance(providerProtocolInstance: AbstractMainProvider): AbstractMainProviderActions {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp(providerProtocolInstance);
		return this._classInstanceSingleton;
	}

	/**
	 * DEFINE THE INSTANCES FOR PROVIDER ACTIONS
	 */
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
		this._WrapNearActionsInstance = AbstractMainWrapNearProviderAction.getInstance(this);
		this._TransactionActionsInstance = AbstractMainTransactionProviderAction.getInstance(this);
	}

	/**
	 * GET THE PROVIDER PROTOCOL AS PARENT INSTANTIATED FROM CURRENT PROVIDER INSTANCE
	 *
	 */
	public getProviderProtocolInstance(): AbstractMainProvider {
		return this._ProviderProtocolInstance;
	}

	/**
	 * GET THE ACTIONS FOR API AS CLASS INSTANCE
	 */
	public getAPIActions(): AbstractMainProviderAPI {
		return this._APIActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR INDEXER AS CLASS INSTANCE
	 */
	public getIndexerActions(): AbstractMainIndexerProviderAction {
		return this._IndexerActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR ACCOUNT AS CLASS INSTANCE
	 */
	public getAccountActions(): AbstractMainAccountProviderAction {
		return this._AccountActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR CONTRACT AS CLASS INSTANCE
	 */
	public getFTContractActions(): AbstractMainFTContractProviderAction {
		return this._FTContractActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR FARM AS CLASS INSTANCE
	 */
	public getFarmActions(): AbstractMainFarmProviderAction {
		return this._FarmActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR MTOKEN AS CLASS INSTANCE
	 */
	public getMTokenActions(): AbstractMainMTokenProviderAction {
		return this._MTokenActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR POOL AS CLASS INSTANCE
	 */
	public getPoolActions(): AbstractMainPoolProviderAction {
		return this._PoolActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR SWAP AS CLASS INSTANCE
	 */
	public getSwapActions(): AbstractMainSwapProviderAction {
		return this._SwapActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR TOKEN AS CLASS INSTANCE
	 */
	public getTokenActions(): AbstractMainTokenProviderActions {
		return this._TokenActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR VAULT AS CLASS INSTANCE
	 */
	public getVaultActions(): AbstractMainVaultProviderActions {
		return this._VaultActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR WRAPNEAR AS CLASS INSTANCE
	 */
	public getWrapNearActions(): AbstractMainWrapNearProviderAction {
		return this._WrapNearActionsInstance;
	}

	/**
	 * GET THE ACTIONS FOR TRANSACTIONS AS CLASS INSTANCE
	 */
	public getTransactionActions(): AbstractMainTransactionProviderAction {
		return this._TransactionActionsInstance;
	}
}
