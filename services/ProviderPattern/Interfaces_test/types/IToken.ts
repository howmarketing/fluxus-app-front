/**
 * Type definition for IFTStorageBalance
 *
 * @export
 * @typedef {IFTStorageBalance}
 */
export type IFTStorageBalance = {
	total: string;
	available: string;
};

/**
 * Type definition for ITokenMetadata
 *
 * @export
 * @typedef {ITokenMetadata}
 */
export type ITokenMetadata = {
	id: string;
	name: string;
	symbol: string;
	decimals: number;
	icon: string;
	ref?: number;
	near?: number;
	total?: number;
	amountLabel?: string;
	amount?: number;
};

/**
 * Type definition for IDepositOptions
 *
 * @export
 * @typedef {IDepositOptions}
 */
export type IDepositOptions = {
	token: ITokenMetadata;
	amount: string;
	msg?: string;
};

/**
 * Type definition for ITokenBalancesView
 *
 * @export
 * @typedef {ITokenBalancesView}
 */
export type ITokenBalancesView = {
	[tokenId: string]: string;
};
