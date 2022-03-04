/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { utils } from 'near-api-js';
import AbstractMainProviderActions from '@ProviderPattern/models/Actions/AbstractMainProviderActions';
import AbstractGenericActions from '@ProviderPattern/models/Actions/AbstractGenericActions';
import { TokenMetadata } from '@ProviderPattern/models/Actions/AbstractMainFTContractProviderAction';
import ProviderPattern from '@ProviderPattern/index';
import { withdrawAction } from '@creators/token';
import {
	executeMultipleTransactions,
	ONE_YOCTO_NEAR,
	RefFiFunctionCallOptions,
	REF_FI_CONTRACT_ID,
	Transaction,
	getWallet,
} from '@ProviderPattern/services/near';
import { storageDepositAction } from '../../services/creators/storage';

export const NEW_ACCOUNT_STORAGE_COST = '0.00125';

const getProvider = () => ProviderPattern.getInstance().getProvider();
const getTokenActions = () => getProvider().getProviderActions().getTokenActions();

export const wnearMetadata: TokenMetadata = {
	id: 'wNEAR',
	name: 'wNEAR',
	symbol: 'wNEAR',
	decimals: 24,
	icon: 'https://i.postimg.cc/4xx2KRxt/wNEAR.png',
};

export const nearMetadata: TokenMetadata = {
	id: 'NEAR',
	name: 'NEAR',
	symbol: 'NEAR',
	decimals: 24,
	icon: 'https://near.org/wp-content/themes/near-19/assets/img/brand-icon.png',
};

export default class AbstractMainWrapNearProviderAction extends AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AbstractMainWrapNearProviderAction;

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
	 * GET THE ACCOUNT ACTIONS INSTACE
	 */
	protected getAccountActionsInstance() {
		return this.getProviderActionsInstace().getAccountActions();
	}

	/**
	 * GET THE VAULTS ACTIONS INSTACE
	 */
	protected getVaultsActionsInstance() {
		return this.getProviderActionsInstace().getVaultActions();
	}

	/**
	 * GET THE FT CONTRACT ACTIONS INSTACE
	 */
	protected getFTContractActionsInstance() {
		return this.getProviderActionsInstace().getFTContractActions();
	}

	public async nearDeposit(amount: string) {
		const transactions: Transaction[] = [
			{
				receiverId: this.getProviderConfigData().WRAP_NEAR_CONTRACT_ID,
				functionCalls: [
					{
						methodName: 'near_deposit',
						args: {},
						gas: '50000000000000',
						amount,
					},
				],
			},
		];

		return executeMultipleTransactions(transactions);
	}

	public async nearWithdraw(amount: string) {
		const transactions: Transaction[] = [
			{
				receiverId: this.getProviderConfigData().WRAP_NEAR_CONTRACT_ID,
				functionCalls: [
					{
						methodName: 'near_withdraw',
						args: { amount: utils.format.parseNearAmount(amount) },
						amount: ONE_YOCTO_NEAR,
					},
				],
			},
		];

		return executeMultipleTransactions(transactions);
	}

	public async wrapNear(amount: string) {
		const transactions: Transaction[] = [];
		const neededStorage = await getTokenActions().checkTokenNeedsStorageDeposit();
		if (neededStorage) {
			transactions.push({
				receiverId: REF_FI_CONTRACT_ID,
				functionCalls: [
					{
						methodName: 'storage_deposit',
						args: {
							account_id: getWallet().getAccountId(),
							registration_only: false,
						},
						gas: '30000000000000',
						amount: neededStorage,
					},
				],
			});
		}

		const actions: RefFiFunctionCallOptions[] = [];
		const balance = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFTContractActions()
			.ftGetStorageBalance(this.getProviderConfigData().WRAP_NEAR_CONTRACT_ID);

		if (!balance || balance.total === '0') {
			actions.push({
				methodName: 'storage_deposit',
				args: {},
				gas: '30000000000000',
				amount: NEW_ACCOUNT_STORAGE_COST,
			});
		}

		actions.push({
			methodName: 'near_deposit',
			args: {},
			gas: '50000000000000',
			amount,
		});

		actions.push({
			methodName: 'ft_transfer_call',
			args: {
				receiver_id: REF_FI_CONTRACT_ID,
				amount: utils.format.parseNearAmount(amount),
				msg: '',
			},
			gas: '50000000000000',
			amount: ONE_YOCTO_NEAR,
		});

		transactions.push({
			receiverId: this.getProviderConfigData().WRAP_NEAR_CONTRACT_ID,
			functionCalls: actions,
		});

		return executeMultipleTransactions(transactions);
	}

	public async unwrapNear(amount: string) {
		const transactions: Transaction[] = [];

		const balance = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFTContractActions()
			.ftGetStorageBalance(this.getProviderConfigData().WRAP_NEAR_CONTRACT_ID);

		if (!balance || balance.total === '0') {
			transactions.push({
				receiverId: ProviderPattern.getInstance().getProvider().getProviderConfigData().WRAP_NEAR_CONTRACT_ID,
				functionCalls: [
					{
						methodName: 'storage_deposit',
						args: {},
						gas: '30000000000000',
						amount: NEW_ACCOUNT_STORAGE_COST,
					},
				],
			});
		}

		transactions.push({
			receiverId: REF_FI_CONTRACT_ID,
			functionCalls: [
				withdrawAction({
					tokenId: ProviderPattern.getInstance().getProvider().getProviderConfigData().WRAP_NEAR_CONTRACT_ID,
					amount: `${utils.format.parseNearAmount(amount) || ''}`,
				}),
			],
		});

		transactions.push({
			receiverId: ProviderPattern.getInstance().getProvider().getProviderConfigData().WRAP_NEAR_CONTRACT_ID,
			functionCalls: [
				{
					methodName: 'near_withdraw',
					args: { amount: utils.format.parseNearAmount(amount) },
					amount: ONE_YOCTO_NEAR,
				},
			],
		});

		const needDeposit = await getTokenActions().checkTokenNeedsStorageDeposit();
		if (needDeposit) {
			transactions.unshift({
				receiverId: REF_FI_CONTRACT_ID,
				functionCalls: [storageDepositAction({ amount: needDeposit })],
			});
		}

		return executeMultipleTransactions(transactions);
	}
}
