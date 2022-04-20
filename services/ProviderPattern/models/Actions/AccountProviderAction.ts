import AbstractMainProviderActions from '@ProviderPattern/models/Actions/AbstractMainProviderActions';
import AbstractGenericActions from '@ProviderPattern/models/Actions/AbstractGenericActions';

import { refFarmViewFunction, refFiViewFunction } from '@ProviderPattern/services/near';

export const ACCOUNT_MIN_STORAGE_AMOUNT = '0.003';

export interface AccountStorageView {
	total: string;
	available: string;
}
export default class AccountProviderAction extends AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AccountProviderAction;

	protected declare _providerActionsInstace: AbstractMainProviderActions;

	/**
	 * GET THE SINGLETON INSTANCE OF THIS CLASS
	 */
	public static getInstance(providerActionsInstance: AbstractMainProviderActions) {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp(providerActionsInstance);
		return this._classInstanceSingleton;
	}

	/**
	 * GET THE PROVICER ACTIONS INSTACE
	 */
	public getProviderActionsInstace() {
		return this._providerActionsInstace;
	}

	/**
	 * GET THE TOKEN ACTIONS INSTACE
	 */
	protected getTokenActionsInstance() {
		return this.getProviderActionsInstace().getTokenActions();
	}

	/**
	 * GET THE CURRENT BALANCE FROM SMART CONTRACT (REF-FINANCE / FLUXUS / ANY IMPLEMENTED)
	 */
	public currentStorageBalance(
		accountId = this.getWallet().getAccountId(),
		fluxusContractName = this.getProviderConfigData().REF_FI_CONTRACT_ID,
	): Promise<AccountStorageView> {
		this.devImplementation = true;
		return refFiViewFunction({
			fluxusContractName,
			methodName: 'storage_balance_of',
			args: { account_id: accountId },
		});
	}

	/**
	 * GET THE CURRENT BALANCE FROM FARM SMART CONTRACT (REF-FINANCE / FLUXUS)
	 */
	public async currentStorageBalanceOfFarm(
		accountId = this.getWallet().getAccountId(),
		useFluxusFarmContract = false,
	): Promise<AccountStorageView> {
		this.devImplementation = true;
		return refFarmViewFunction({
			methodName: 'storage_balance_of',
			args: { account_id: accountId },
			useFluxusFarmContract,
		});
	}
}
