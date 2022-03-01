import BN from 'bn.js';
import { Near } from 'near-api-js';
import { IMainProviderConfig } from '@ProviderPattern/Interfaces';
import AbstractMainProviderActions from '@ProviderPattern/models/Actions/AbstractMainProviderActions';
import { functionCall } from 'near-api-js/lib/transaction';

export type IFunctionCall = {
	contractId?: string;
	methodName?: string;
	args?: Record<any, any>;
	gas?: BN;
	amount?: BN;
};

export type IBatchTransaction = { receiverId: string; functionsCall: Array<IFunctionCall> };

export type IExecBatchTransaction = Array<IBatchTransaction>;

/**
 * GENERIC IMPLEMENTS FOR ANY PROVIDER ACTIONS CLASS
 */
export default class AbstractGenericActions {
	/**
	 * INDICATE THAT THIS CLASS IS IN DEV IMPLEMENTATION PROGRESS
	 *  *(Just to indicate some dev implementation progress or failures tests.)*
	 * @description When you can see this as class property it means:
	 *  - The class is currently in development progress, not ready to release versions;
	 *  - When this is into some class method, it means that thiss method is currently in development progress and should not be implemented to interface tree;
	 */
	protected declare devImplementation: any;

	/**
	 * PERSIST THE SINGLETON INSTANCE AS STATIC PROTECTED PROPERTY
	 *
	 *
	 * **(The default behaivor of singleton class, does not allow the third party to instantiate then by your own.)**
	 * @description ------------------------
	 *		- 1.0: The instance
	 * 		- 1.0: Constructor as a private or protected access *(Third party cant access, unless it extends as parent abstraction)*.
	 *		- 1.1: Supplie a method that manage the instance as singleston by a public static method called getInstance
	 *
	 * 	__EX:__
	 * 		- 1)
	 * 				SomeActionClassThatExtendsGeneric.getInstance(any, param, could, exist, as they, own, ...argumentsImplemented);
	 *
	 * @description ------------------------
	 * 		- 1.0 Through a public static class method that returns the existent own instance;
	 * 		- 1.1 If the instance once has been required, the singleton behaivor should keep this available from alive memory, because of static declaration,
	 */
	protected static _classInstanceSingleton: AbstractGenericActions;

	protected declare _providerActionsInstace: AbstractMainProviderActions;

	/**
	 * GET THE SINGLETON INSTANCE
	 * @param {AbstractMainProviderActions} providerActionsInstance
	 */
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

	protected getProviderActions() {
		return this._providerActionsInstace.getProviderProtocolInstance().getProviderActions();
	}

	/**
	 * EXEC FUNCTIONS TYPE OF FUNCTION_CALL FROM VAULT SMART CONTRACT
	 * @description If not specified the amount, that coul be a signed transaction, without need to user aprove the transaction
	 * @description When it is not needed to aprove transaction, it not even open ther user wallet
	 */
	public async execContractAsCallFunction<T extends unknown>({
		contractId = '',
		methodName = '',
		args = {},
		gas = new BN('300000000000000'),
		amount = new BN(0),
	}: IFunctionCall): Promise<T> {
		const functionCallResponse = await this.getWallet()
			.account()
			.functionCall(contractId, methodName, args, gas, amount);
		return functionCallResponse as T;
	}

	/**
	 * EXEC FUNCTIONS TYPE OF FUNCTION_VIEW FROM VAULT SMART CONTRACT
	 * @description It is in mustly case, user wallet sign not be mandatory for work as expected
	 */
	public async execContractAsViewFunction<T extends unknown>({
		contractId = '',
		methodName = '',
		args = {},
	}: {
		contractId?: string;
		methodName?: string;
		args?: Record<any, any>;
	}): Promise<T> {
		const viewFunctionResponse = await this.getWallet().account().viewFunction(contractId, methodName, args);
		return viewFunctionResponse as T;
	}

	/**
	 * EXECUTE MULTIPLE FUNCTIONS CALL AS ONE
	 * CREATE A BATCH TRANSACTION AS FUNCTION CALL TYPE
	 * @description It give sure about function that depends the other for have success.
	 * @description Pay attention to gas needed for each function call.
	 * @description Gas pre-payed have to be calculated carefully before realease some implementation of this
	 */
	public async execBatchTransaction(calls: IExecBatchTransaction) {
		const $this = this;
		const wallet = this.getWallet();
		if (!wallet) {
			throw new Error('Wallet connection is mandatory.');
		}
		const transactions = await Promise.all(
			calls.map((call, index: number) =>
				$this.createBatchTransaction({ receiverId: call.receiverId, functionsCall: call.functionsCall }),
			),
		);
		const args = { transactions };
		return this.getWallet().requestSignTransactions(args);
	}

	/**
	 * create MULTIPLE FUNCTIONS CALL AS ONE
	 * CREATE A BATCH TRANSACTION AS FUNCTION CALL TYPE
	 * @description It give sure about function that depends the other for have success.
	 * @description Pay attention to gas needed for each function call.
	 * @description Gas pre-payed have to be calculated carefully before realease some implementation of this
	 */
	public async createBatchTransaction({ ...params }: { receiverId: string; functionsCall: Array<IFunctionCall> }) {
		const wallet = this.getWallet();
		const { receiverId, functionsCall } = params;

		if (!wallet) {
			throw new Error('Wallet must be connected before create transactions.');
		}
		return wallet.createTransaction({
			receiverId,
			nonceOffset: 1,
			actions: functionsCall.map(fc =>
				functionCall(fc?.methodName || '', fc?.args || {}, fc?.gas || new BN('0'), fc?.amount || new BN('0')),
			),
		});
	}
}
