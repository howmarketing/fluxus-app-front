import BN from 'bn.js';
import {
	RefFiFunctionCallOptions,
	REF_FI_CONTRACT_ID,
	REF_FARM_CONTRACT_ID,
	getWallet,
	refFiViewFunction,
} from '../near';

export const STORAGE_PER_TOKEN = '0.003';
export const STORAGE_TO_REGISTER_WITH_FT = '0.1';
export const STORAGE_TO_REGISTER_WITH_MFT = '0.1';
export const MIN_DEPOSIT_PER_TOKEN = new BN('3000000000000000000000');
export const MIN_DEPOSIT_PER_TOKEN_FARM = new BN('45000000000000000000000');
export const ONE_MORE_DEPOSIT_AMOUNT = '0.01';

interface StorageDepositActionOptions {
	accountId?: string;
	registrationOnly?: boolean;
	amount: string;
}

export const storageDepositAction = ({
	accountId = getWallet().getAccountId(),
	registrationOnly = false,
	amount,
}: StorageDepositActionOptions): RefFiFunctionCallOptions => ({
	methodName: 'storage_deposit',
	args: {
		account_id: accountId,
		registration_only: registrationOnly,
	},
	gas: '4000000000000',
	amount,
});

export const storageDepositForTokenAction = (
	accountId: string = getWallet().getAccountId(),
): RefFiFunctionCallOptions =>
	storageDepositAction({
		accountId,
		amount: STORAGE_PER_TOKEN,
	});

export const storageDepositForFTAction = () =>
	storageDepositAction({
		accountId: REF_FI_CONTRACT_ID,
		amount: STORAGE_TO_REGISTER_WITH_FT,
	});

export const storageDepositForMFTAction = () =>
	storageDepositAction({
		accountId: REF_FARM_CONTRACT_ID,
		amount: STORAGE_TO_REGISTER_WITH_MFT,
	});

export const needDepositStorage = async (accountId = getWallet().getAccountId()) => {
	const storage = await refFiViewFunction({
		methodName: 'get_user_storage_state',
		args: { account_id: accountId },
	});

	return new BN(storage?.deposit).lte(new BN(storage?.usage));
};
