/* eslint-disable max-classes-per-file */
import BN from 'bn.js';
import { IAction, IEnum, IFunctionCallPermission } from '@ProviderPattern/Interfaces_test/types';

/**
 * ### Any for literals (string | number | symbol | object)
 *
 * @export
 * @typedef {IAnyLiteral}
 */
export type IAnyLiteral =
	| string
	| number
	| boolean
	| symbol
	| object
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

/**
 * ### Type for register recorder as any recorder
 *
 * @export
 * @typedef {IAnyRecord}
 * @template T extends string | number | symbol = string | number | symbol
 * @template U = Record<string | number | symbol, IAnyLiteral>
 */
export type IAnyRecord<
	T extends string | number | symbol = string | number | symbol,
	U extends IAnyLiteral = Record<string | number | symbol, IAnyLiteral>,
> = { [P in T]: U }; // Record<T, U>; //TODO: I do not have 100% sure yet about the infer {} treated as object Recorder is able to typescript <4.6; Until the end i think that i will be sure and got done this TODO

/**
 * ### Type any for array
 *
 * @export
 * @typedef {IAnyArray}
 * @template T extends ILiteralsAny | IAnyRecord | Array<ILiteralsAny | IAnyRecord> = string
 */
export type IAnyArray<T extends IAnyLiteral | IAnyRecord | Array<IAnyLiteral | IAnyRecord> = string> = Array<T>;

/**
 * ### Type IAny as any
 *
 * @export
 * @typedef {IAny}
 */
export type IAny = IAnyLiteral | IAnyRecord | IAnyArray;

/**
 * ### User default balance from wallet
 *
 * @export
 * @typedef {IAccountBalance}
 */
export type IAccountBalance = {
	total: string;
	stateStaked: string;
	staked: string;
	available: string;
};

/**
 * ### Type for authorization app
 *
 * @export
 * @typedef {IAccountAuthorizedApp}
 */
export type IAccountAuthorizedApp = {
	contractId: string;
	amount: string;
	publicKey: string;
};

/**
 * ### Type for list the authorizes apps
 *
 * @export
 * @typedef {IAccountAuthorizesApps}
 */
export type IAccountAuthorizesApps = IAccountAuthorizedApp[];

/**
 * ### User available near balance balance from wallet
 *
 * @export
 * @typedef {IBalance}
 */
export type IBalance = {
	amountAvailable: string;
	balanceDetails: IAccountBalance;
};

/**
 * ### Type of Special wallet transaction creator properties
 *
 * @export
 * @typedef {ISpecialWalletAccountCreateTransaction}
 */
export type ISpecialWalletAccountCreateTransaction = {
	receiverId: string;
	actions: Array<IAction>;
	nonceOffset?: number;
};

/**
 * Record positions as user rewards.
 * ### @example
 *
 * @export
 * @typedef {IUserListRewards}
 */
export type IUserListRewards = Record<string, string>;

/**
 * ### View storage of account user
 *
 * @export
 * @typedef {IAccountStorageView}
 */
export type IAccountStorageView = {
	available: string;
	total: string;
};

/**
 * ### Create some assignable by extends
 *
 * @export
 * @abstract
 * @class IAssignable
 * @typedef {IAssignable}
 */
export declare abstract class IAssignable {
	constructor(properties: any);
}
/**
 * ### Type for signature
 *
 * @export
 * @class ISignature
 * @typedef {ISignature}
 * @extends {IAssignable}
 */
export declare class ISignature extends IAssignable {
	/**
	 * Type for key as ("private" | "public" | "secret")
	 *
	 * @type {KeyType}
	 */
	keyType: KeyType;

	/**
	 * Data value as Uint8Array
	 *
	 * @type {Uint8Array}
	 */
	data: Uint8Array;
}
/**
 * TODO: Add doc title
 *
 * @export
 * @class IFullAccessPermission
 * @typedef {IFullAccessPermission}
 * @extends {IAssignable}
 */
export declare class IFullAccessPermission extends IAssignable {}
/**
 * TODO: Add doc title
 *
 * @export
 * @class IAccessKeyPermission
 * @typedef {IAccessKeyPermission}
 * @extends {IEnum}
 */
export declare class IAccessKeyPermission extends IEnum {
	/**
	 * Description placeholder
	 *
	 * @type {IFunctionCallPermission}
	 */
	functionCall: IFunctionCallPermission;

	/**
	 * Description placeholder
	 *
	 * @type {IFullAccessPermission}
	 */
	fullAccess: IFullAccessPermission;
}

/**
 * TODO: Add doc title
 *
 * @export
 * @typedef {IAccessKey}
 */
export type IAccessKey = IAssignable & {
	nonce: number;

	permission: IAccessKeyPermission;
};

/**
 * Contains a list of the valid transaction Actions available with this API
 * @see {@link https://nomicon.io/RuntimeSpec/Actions.html | Actions Spec}
 */
export declare class ICreateAccount extends IAction {}
/**
 * TODO: Add doc title
 *
 * @export
 * @typedef {IDeployContract}
 */
export type IDeployContract = IAction & {
	code: Uint8Array;
};

/**
 * TODO: Add doc title
 *
 * @export
 * @typedef {ITransfer}
 */
export type ITransfer = IAction & {
	deposit: BN;
};

/** All supported key types */
// eslint-disable-next-line no-shadow
export declare enum IKeyType {
	ED25519 = 0,
}

/**
 * IPublicKey representation that has type and bytes of the key.
 */
export declare class IPublicKey extends IAssignable {
	/**
	 * Description placeholder
	 *
	 * @type {IKeyType}
	 */
	keyType: KeyType;

	/**
	 * Description placeholder
	 *
	 * @type {Uint8Array}
	 */
	data: Uint8Array;

	/**
	 * Description placeholder
	 *
	 * @static
	 * @param {(string | IPublicKey)} value
	 * @returns {IPublicKey}
	 */
	static from(value: string | IPublicKey): IPublicKey;

	/**
	 * Description placeholder
	 *
	 * @static
	 * @param {string} encodedKey
	 * @returns {IPublicKey}
	 */
	static fromString(encodedKey: string): IPublicKey;

	/**
	 * Description placeholder
	 *
	 * @returns {string}
	 */
	toString(): string;

	/**
	 * Description placeholder
	 *
	 * @param {Uint8Array} message
	 * @param {Uint8Array} signature
	 * @returns {boolean}
	 */
	verify(message: Uint8Array, signature: Uint8Array): boolean;
}

/**
 * TODO: Add doc title
 *
 * @export
 * @typedef {IAddKey}
 */
export type IAddKey = IAction & {
	publicKey: IPublicKey;

	accessKey: IAccessKey;
};
/**
 * TODO: Add doc title
 *
 * @export
 * @typedef {IDeleteKey}
 */
export type IDeleteKey = IAction & {
	publicKey: IPublicKey;
};
/**
 * TODO: Add doc title
 *
 * @export
 * @typedef {IDeleteAccount}
 */
export type IDeleteAccount = IAction & {
	beneficiaryId: string;
};

/**
 * TODO: Add doc title
 *
 * @export
 * @abstract
 * @class IKeyPair
 * @typedef {IKeyPair}
 */
export declare abstract class IKeyPair {
	/**
	 * Description placeholder
	 *
	 * @abstract
	 * @param {Uint8Array} message
	 * @returns {ISignature}
	 */
	abstract sign(message: Uint8Array): ISignature;

	/**
	 * Description placeholder
	 *
	 * @abstract
	 * @param {Uint8Array} message
	 * @param {Uint8Array} signature
	 * @returns {boolean}
	 */
	abstract verify(message: Uint8Array, signature: Uint8Array): boolean;

	/**
	 * Description placeholder
	 *
	 * @abstract
	 * @returns {string}
	 */
	abstract toString(): string;

	/**
	 * Description placeholder
	 *
	 * @abstract
	 * @returns {IPublicKey}
	 */
	abstract getPublicKey(): IPublicKey;

	/**
	 * @param curve Name of elliptical curve, case-insensitive
	 * @returns Random KeyPair based on the curve
	 */
	static fromRandom(curve: string): IKeyPair;

	/**
	 * Description placeholder
	 *
	 * @static
	 * @param {string} encodedKey
	 * @returns {IKeyPair}
	 */
	static fromString(encodedKey: string): IKeyPair;
}
