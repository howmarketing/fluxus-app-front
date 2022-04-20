/* eslint-disable max-classes-per-file */
import BN from 'bn.js';
import {
	IAssignable,
	ISignature,
	ICreateAccount,
	IDeployContract,
	IPublicKey,
	ITransfer,
	IStake,
	IAddKey,
	IDeleteKey,
	IDeleteAccount,
} from '@ProviderPattern/Interfaces_test/types';
import { PublicKey } from 'near-api-js/lib/utils';
import { Action } from 'near-api-js/lib/transaction';

/** @hidden @module */
export declare abstract class IEnum {
	enum: string;

	constructor(properties: any);
}

/**
 * ### Type for IFunctionCall from Functions type
 *
 * @export
 * @typedef {IFunctionCall}
 */
export type IFunctionCall = {
	contractId?: string | undefined;

	amount?: BN;

	methodName: string;

	args: Uint8Array | Record<string, any>;

	gas?: BN;

	deposit?: BN;
};

/**
 * Represents the action of create transaction
 *
 * @export
 * @typedef {IAction}
 */
export declare class IAction extends IEnum {
	createAccount: ICreateAccount;

	deployContract: IDeployContract;

	functionCall: IFunctionCall & IAssignable;

	transfer: ITransfer;

	stake: IStake;

	addKey: IAddKey;

	deleteKey: IDeleteKey;

	deleteAccount: IDeleteAccount;
}

/**
 * Type for batch transactions
 *
 * @export
 * @typedef {IBatchTransaction}
 */
export type IBatchTransaction = {
	receiverId: string;
	functionsCall: Array<IFunctionCall>;
};

/**
 * Type for execute multiple batch transactions
 *
 * @export
 * @typedef {IExecBatchTransaction}
 */
export type IExecBatchTransaction = Array<IBatchTransaction>;

/**
 * Should be used to represent the response structure from  RPC  function view call
 *
 * @export
 * @typedef {IParseActionView}
 */
export type IParseActionView = (action: unknown) => Promise<{
	dateTime: moment.Moment;
	txUrl: string;
	data: {
		Action: string;
	};
	status: unknown;
}>;

/**
 * Type for inference of promise to object response
 *
 * @export
 * @typedef {IAwaited}
 * @template T
 */
export type IAwaited<T> = T extends Promise<infer P> ? P : never;
export type IActionData = IAwaited<ReturnType<IParseActionView>>;

/**
 * Type of check transaction with primary props generic that contains the transaction
 *   object
 *
 * @export
 * @typedef {ICheckTransaction}
 */
export type ICheckTransaction = {
	[x: string]: unknown;
	transaction?: Record<string, string> | undefined;
};

/**
 * Interface for transactions signable
 *
 * @export
 * @class ITransaction
 * @typedef {ITransaction}
 * @extends {IAssignable}
 */
export declare class ITransaction extends Assignable {
	signerId: string;

	publicKey: IPublicKey;

	nonce: number;

	receiverId: string;

	actions: Action[];

	blockHash: Uint8Array;

	encode(): Uint8Array;

	static decode(bytes: Buffer): Transaction;
}
export declare abstract class Assignable {
	constructor(properties: any);
}
export declare class Transaction extends IAssignable {
	signerId: string;

	publicKey: PublicKey;

	nonce: number;

	receiverId: string;

	actions: Action[];

	blockHash: Uint8Array;

	encode(): Uint8Array;

	static decode(bytes: Buffer): Transaction;
}

/**
 * Represents the assignment of transactions
 *
 * @export
 * @class IFunctionCallPermission
 * @typedef {IFunctionCallPermission}
 * @extends {IAssignable}
 */
export declare interface ISignedTransaction extends IAssignable {
	transaction: ITransaction;

	signature: ISignature;

	encode(): Uint8Array;

	decode?(bytes: Buffer): ISignedTransaction;
}

/**
 * Represents the permissions for call function
 *
 * @export
 * @class IFunctionCallPermission
 * @typedef {IFunctionCallPermission}
 * @extends {IAssignable}
 */
export declare interface IFunctionCallPermission extends IAssignable {
	allowance?: BN;

	receiverId: string;

	methodNames: string[];
}

export interface IRefFiViewFunctionOptions {
	methodName: string;
	args?: object;
	fluxusContractName?: string;
}

export interface IRefFiFunctionCallOptions extends IRefFiViewFunctionOptions {
	gas?: string;
	amount?: string;
	useFluxusFarmContract?: boolean;
}
export interface IStorageDepositActionOptions {
	accountId?: string;
	registrationOnly?: boolean;
	amount: string;
}
