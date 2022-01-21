import { storageDepositAction } from './creators/storage';
import { refFarmViewFunction, refFiFunctionCall, refFiViewFunction, getWallet } from './near';

export const ACCOUNT_MIN_STORAGE_AMOUNT = '0.003';
export interface RefPrice {
	'ref-finance': {
		usd: number;
	};
}

export const initializeAccount = () =>
	refFiFunctionCall(
		storageDepositAction({
			accountId: getWallet().getAccountId(),
			registrationOnly: true,
			amount: ACCOUNT_MIN_STORAGE_AMOUNT,
		}),
	);

export interface AccountStorageView {
	total: string;
	available: string;
}

export const currentStorageBalance = (accountId: string): Promise<AccountStorageView> =>
	refFiViewFunction({
		methodName: 'storage_balance_of',
		args: { account_id: accountId },
	});

export const currentStorageBalanceOfFarm = (
	accountId: string,
	useFluxusFarmContract = false,
): Promise<AccountStorageView> =>
	refFarmViewFunction({
		methodName: 'storage_balance_of',
		args: { account_id: accountId },
		useFluxusFarmContract,
	});
