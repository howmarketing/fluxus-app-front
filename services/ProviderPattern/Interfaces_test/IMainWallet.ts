import { IAny, ITransaction, IBalance, IAction } from '@ProviderPattern/Interfaces_test';
import { WalletConnection } from 'near-api-js';
import { Action, Transaction } from 'near-api-js/lib/transaction';

/**
 * #### Type definitions to wallet
 *
 * @export ISyncInfo
 * @interface SyncInfo
 * @typedef {ISyncInfo}
 */
export interface ISyncInfo {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	latestBlockHash: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {number}
	 */
	latestBlockHeight: number;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	latestBlockTime: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	latestStateRoot: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {boolean}
	 */
	syncing: boolean;
}

/**
 * #### Type IVersion definitions to wallet
 *
 * @interface IVersion
 * @typedef {IVersion}
 */
export interface IVersion {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	version: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	build: string;
}

/**
 * #### Type definitions to wallet
 *
 * @export INodeStatusResult
 * @interface NodeStatusResult
 * @typedef {INodeStatusResult}
 */
export interface INodeStatusResult {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	chainId: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	rpcAddr: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {ISyncInfo}
	 */
	syncInfo: ISyncInfo;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string[]}
	 */
	validators: string[];

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {IAny}
	 */
	version: IAny;
}

/**
 * #### Type IBlockHash definitions to wallet
 *
 * @typedef {IBlockHash}
 */
export type IBlockHash = string;

/**
 * #### Type IBlockHeight definitions to wallet
 *
 * @typedef {IBlockHeight}
 */
export type IBlockHeight = number;

/**
 * #### Type IBlockId definitions to wallet
 *
 * @export
 * @typedef {IBlockId}
 */
export declare type IBlockId = IBlockHash | IBlockHeight;

/**
 * #### Type IFinality definitions to wallet
 *
 * @export
 * @typedef {IFinality}
 */
export declare type IFinality = 'optimistic' | 'near-final' | 'final';

/**
 * #### Type IBlockReference definitions to wallet
 *
 * @export
 * @typedef {IBlockReference}
 */
export declare type IBlockReference =
	| {
			blockId: IBlockId;
	  }
	| {
			finality: IFinality;
	  }
	| {
			syncCheckpoint: 'genesis' | 'earliestAvailable';
	  };

/**
 * #### Type IExecutionStatusBasic definitions to wallet
 *
 * @export
 * @enum {IExecutionStatusBasic}
 */
export type IExecutionStatusBasic = {
	Unknown: 'Unknown';
	Pending: 'Pending';
	Failure: 'Failure';
};

/**
 * #### Type definitions to wallet
 *
 * @export IExecutionStatus
 * @interface ExecutionStatus
 * @typedef {IExecutionStatus}
 */
export interface IExecutionStatus {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {?string}
	 */
	SuccessValue?: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {?string}
	 */
	SuccessReceiptId?: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {?IExecutionError}
	 */
	Failure?: IExecutionError;
}

/**
 * #### Type IFinalExecutionStatusBasic definitions to wallet
 *
 * @export
 * @enum {IFinalExecutionStatusBasic}
 */
export type IFinalExecutionStatusBasic = {
	NotStarted: 'NotStarted';
	Started: 'Started';
	Failure: 'Failure';
};

/**
 * #### Type definitions to wallet
 *
 * @export IExecutionError
 * @interface ExecutionError
 * @typedef {IExecutionError}
 */
export interface IExecutionError {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	errorMessage: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	errorType: string;
}

/**
 * #### Type definitions to wallet
 *
 * @export IFinalExecutionStatus
 * @interface FinalExecutionStatus
 * @typedef {IFinalExecutionStatus}
 */
export interface IFinalExecutionStatus {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {?string}
	 */
	SuccessValue?: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {?IExecutionError}
	 */
	Failure?: IExecutionError;
}

/**
 * #### Type definitions to wallet
 *
 * @export IExecutionOutcomeWithId
 * @interface IExecutionOutcomeWithId
 * @typedef {IExecutionOutcomeWithId}
 */
export interface IExecutionOutcomeWithId {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	id: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {IExecutionOutcome}
	 */
	outcome: IExecutionOutcome;
}

/**
 * #### Type definitions to wallet
 *
 * @export IExecutionOutcome
 * @interface ExecutionOutcome
 * @typedef {IExecutionOutcome}
 */
export interface IExecutionOutcome {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string[]}
	 */
	logs: string[];

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string[]}
	 */
	receiptIds: string[];

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {number}
	 */
	gasBurnt: number;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {(ExecutionStatus | ExecutionStatusBasic)}
	 */
	status: IExecutionStatus | IExecutionStatusBasic;
}

/**
 * #### Type definitions to wallet
 *
 * @export IIExecutionOutcomeWithIdView
 * @interface IExecutionOutcomeWithIdView
 * @typedef {IIExecutionOutcomeWithIdView}
 */
export interface IIExecutionOutcomeWithIdView {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {IAny}
	 */
	proof?: IAny;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	blockHash: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	id: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {IExecutionOutcome}
	 */
	outcome: IExecutionOutcome;
}

/**
 * #### Type definitions to wallet
 *
 * @export IFinalExecutionOutcome
 * @interface FinalExecutionOutcome
 * @typedef {IFinalExecutionOutcome}
 */
export interface IFinalExecutionOutcome {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {(FinalExecutionStatus | FinalExecutionStatusBasic)}
	 */
	status: IFinalExecutionStatus | IFinalExecutionStatusBasic;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {*}
	 */
	transaction: any;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type { IExecutionOutcomeWithId }
	 */
	transactionOutcome: IExecutionOutcomeWithId;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {IExecutionOutcomeWithId[]}
	 */
	receiptsOutcome: IExecutionOutcomeWithId[];
}

/**
 * #### Type definitions to wallet
 *
 * @export ITotalWeight
 * @interface TotalWeight
 * @typedef {ITotalWeight}
 */
export interface ITotalWeight {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {number}
	 */
	num: number;
}

/**
 * #### Type definitions to wallet
 *
 * @export IBlockHeader
 * @interface BlockHeader
 * @typedef {IBlockHeader}
 */
export interface IBlockHeader {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {number}
	 */
	height: number;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	epochId: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	nextEpochId: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	hash: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	prevHash: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	prevStateRoot: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	chunkReceiptsRoot: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	chunkHeadersRoot: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	chunkTxRoot: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	outcomeRoot: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {number}
	 */
	chunksIncluded: number;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	challengesRoot: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {number}
	 */
	timestamp: number;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	timestampNanosec: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	randomValue: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {any[]}
	 */
	validatorProposals: any[];

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {boolean[]}
	 */
	chunkMask: boolean[];

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	gasPrice: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	rentPaid: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	validatorReward: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	totalSupply: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {any[]}
	 */
	challengesResult: any[];

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	lastFinalBlock: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	lastDsFinalBlock: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	nextBpHash: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	blockMerkleRoot: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string[]}
	 */
	approvals: string[];

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {string}
	 */
	signature: string;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @type {number}
	 */
	latestProtocolIVersion: number;
}

/**
 * #### Type definitions to wallet
 *
 * @export
 * @interface IMainWallet
 * @typedef {IMainWallet}
 */
export interface IMainWallet extends WalletConnection {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @param {{
			receiverId: string;
			actions: IAction[];
			nonceOffset?: number;
		}} $props
	 * @returns {Promise<ITransaction>}
	 */
	createTransaction({
		receiverId,
		actions,
		nonceOffset,
	}: {
		receiverId: string;
		actions: Action[];
		nonceOffset?: number;
	}): Promise<Transaction>;
}

/**
 * #### Type definitions to wallet
 *
 * @export
 * @interface IMainWalletAccount
 * @typedef {IMainWalletAccount}
 */
export interface IMainWalletAccount {
	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @returns {Promise<IBalance>}
	 */
	getBalance(): Promise<IBalance>;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @param {string} receiverId
	 * @param {IAction[]} actions
	 * @returns {Promise<FinalExecutionOutcome>}
	 */
	sendTransactionWithActions(receiverId: string, actions: IAction[]): Promise<IFinalExecutionOutcome>;

	/**
	 * ##### Property from Type definitions to wallet
	 *
	 * @param {{
			receiverId: string;
			actions: Action[];
			nonceOffset?: number;
		}} $props
	 * @returns {Promise<IAny>}
	 */
	createTransaction($props: { receiverId: string; actions: IAction[]; nonceOffset?: number }): Promise<Transaction>;
}
