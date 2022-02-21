/* eslint-disable prefer-destructuring */
import { Near, keyStores, utils } from 'near-api-js';
import { functionCall } from 'near-api-js/lib/transaction';
import BN from 'bn.js';
import AbstractMainWallet from '@ProviderPattern/models/AbstractMainWallet';
import getConfig from './config';
import ProviderPattern from './ProviderPattern';

const config = getConfig();

export const REF_FI_CONTRACT_ID = config.REF_FI_CONTRACT_ID;
export const FLUXUS_CONTRACT_ID = config.FLUXUS_CONTRACT_ID;

export const REF_ADBOARD_CONTRACT_ID = config.REF_ADBOARD_CONTRACT_ID;

export const REF_FARM_CONTRACT_ID = config.REF_FARM_CONTRACT_ID;
export const FLUXUS_FARM_CONTRACT_ID = config.FLUXUS_FARM_CONTRACT_ID;

export const REF_AIRDRAOP_CONTRACT_ID = config.REF_AIRDROP_CONTRACT_ID;

export const REF_TOKEN_ID = config.REF_TOKEN_ID;
export const FLUXUS_TOKEN_ID = config.FLUXUS_TOKEN_ID;

export const LP_STORAGE_AMOUNT = '0.01';

export const ONE_YOCTO_NEAR = '0.000000000000000000000001';

export const near = {};
let nearConnection: any = null;
export const getNear = (): Near => {
	if (nearConnection !== null) {
		return nearConnection;
	}
	nearConnection = new Near({ headers: {}, keyStore: new keyStores.BrowserLocalStorageKeyStore(), ...config });
	return nearConnection;
};
export const wallet: any = null;
const walletInstance: any = null;
export const getWallet = (): AbstractMainWallet => ProviderPattern.getProviderInstance().getWallet();
// if (walletInstance !== null) {
// 	return walletInstance;
// }
// walletInstance = new SpecialWallet(getNear(), config.REF_FI_CONTRACT_ID);
// return walletInstance;

export const getGas = (gas: string) => (gas ? new BN(gas) : new BN('100000000000000'));

export const getAmount = (amount: string) => {
	const amountNear = `${utils.format.parseNearAmount(`${amount}`.toString())}`;
	return amount ? new BN(amountNear) : new BN('0');
};

export interface RefFiViewFunctionOptions {
	methodName: string;
	args?: object;
	fluxusContractName?: string;
}

export interface RefFiFunctionCallOptions extends RefFiViewFunctionOptions {
	gas?: string;
	amount?: string;
	useFluxusFarmContract?: boolean;
}

export const refFiFunctionCall = ({
	methodName,
	args,
	gas,
	amount,
	fluxusContractName = '',
}: RefFiFunctionCallOptions) => {
	const receiverContractId = fluxusContractName || REF_FI_CONTRACT_ID;
	return getWallet()
		.account()
		.functionCall(receiverContractId, methodName, args, getGas(gas || ''), getAmount(amount || ''));
};

export const refFiViewFunction = ({
	methodName,
	args,
	fluxusContractName = '',
	debug = false,
}: RefFiViewFunctionOptions & { debug?: boolean | undefined }) => {
	const receiverContractId = fluxusContractName || REF_FI_CONTRACT_ID;
	if (debug) {
		console.log('fluxusContractName: ', fluxusContractName);
		console.log('is fluxus?: ', !!fluxusContractName);
		console.log('receiverContractId: ', receiverContractId);
	}
	if (!getWallet().isSignedIn()) {
		// return { error: 'no user logged in' } as any;
	}
	return getWallet().account().viewFunction(receiverContractId, methodName, args);
};

export const refFiManyFunctionCalls = (functionCalls: RefFiFunctionCallOptions[]) => {
	if (!getWallet().isSignedIn()) {
		return { error: 'no user logged in' } as any;
	}
	const actions = functionCalls.map(fc =>
		functionCall(fc.methodName, fc?.args || {}, getGas(`${fc?.gas || ''}`), getAmount(`${fc?.amount || ''}`)),
	);

	return getWallet().account().sendTransactionWithActions(REF_FI_CONTRACT_ID, actions);
};

export interface Transaction {
	receiverId: string;
	functionCalls: RefFiFunctionCallOptions[];
}

export const executeMultipleTransactions = async (transactions: Transaction[], callbackUrl?: string) => {
	if (!getWallet().isSignedIn()) {
		return { error: 'no user logged in' } as any;
	}
	const nearTransactions = await Promise.all(
		transactions.map((t, i) =>
			getWallet().createTransaction({
				receiverId: t.receiverId,
				nonceOffset: i + 1,
				actions: t.functionCalls.map(fc =>
					functionCall(
						fc.methodName,
						fc?.args || {},
						getGas(`${fc?.gas || ''}`),
						getAmount(`${fc?.amount || ''}`),
					),
				),
			}),
		),
	);

	return getWallet().requestSignTransactions(nearTransactions, callbackUrl);
};

export const refFarmFunctionCall = ({
	methodName,
	args,
	gas,
	amount,
	useFluxusFarmContract = false,
}: RefFiFunctionCallOptions) => {
	const farmContract = useFluxusFarmContract ? FLUXUS_FARM_CONTRACT_ID : REF_FARM_CONTRACT_ID;

	return getWallet()
		.account()
		.functionCall(farmContract, methodName, args, getGas(`${gas || ''}`), getAmount(`${amount || ''}`));
};

export const refFarmViewFunction = async ({
	methodName,
	args,
	useFluxusFarmContract = false,
}: RefFiViewFunctionOptions & { useFluxusFarmContract?: boolean }) => {
	if (!getWallet().isSignedIn()) {
		// return {} as any;
	}
	const farmContract = useFluxusFarmContract ? FLUXUS_FARM_CONTRACT_ID : REF_FARM_CONTRACT_ID;
	const params = { useFluxusFarmContract, farmContract, methodName, args };
	const result = await getWallet().account().viewFunction(farmContract, methodName, args);
	if (process.env.DEBUG_LOG === '1' || process.env.DEBUG_LOG === 'true' || process.env.DEBUG_LOG === 'yes') {
		console.log(`FarmRPC:(${methodName}) `, { result, ...params });
	}
	return result;
};

export const refFarmManyFunctionCalls = async (
	functionCalls: RefFiFunctionCallOptions[],
	useFluxusFarmContract = false,
) => {
	const farmContract = useFluxusFarmContract ? FLUXUS_FARM_CONTRACT_ID : REF_FARM_CONTRACT_ID;
	const actions = functionCalls.map(fc =>
		functionCall(fc.methodName, fc?.args || {}, getGas(`${fc?.gas || ''}`), getAmount(`${fc?.amount || ''}`)),
	);
	const result = await getWallet().account().sendTransactionWithActions(farmContract, actions);
	if (process.env.DEBUG_LOG === '1' || process.env.DEBUG_LOG === 'true' || process.env.DEBUG_LOG === 'yes') {
		console.log('FarmManyRPC: ', { functionsToCall: functionCalls, result });
	}
	return result;
};

export const executeFarmMultipleTransactions = async (transactions: Transaction[], callbackUrl?: string) => {
	if (!getWallet()) {
		throw new Error('Wallet must be connected before create transactions.');
	}
	const nearTransactions = await Promise.all(
		transactions.map((t, i) =>
			getWallet().createTransaction({
				receiverId: t.receiverId,
				nonceOffset: i + 1,
				actions: t.functionCalls.map(fc =>
					functionCall(
						fc.methodName,
						fc?.args || {},
						getGas(`${fc?.gas || ''}`),
						getAmount(`${fc?.amount || ''}`),
					),
				),
			}),
		),
	);

	return getWallet().requestSignTransactions(nearTransactions, callbackUrl);
};
