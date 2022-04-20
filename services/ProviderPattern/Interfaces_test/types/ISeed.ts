/**
 * ### Type for  ISeedInfo
 *
 * @export
 * @typedef {ISeedInfo}
 */
export type ISeedInfo = {
	seedId: string;
	seedType: string;
	farms: Array<string>;
	nextIndex: number;
	amount: string;
	minDeposit: string;
};

/**
 * ### Type for  ISeed
 *
 * @export
 * @typedef {ISeed}
 */
export type ISeed = { seedId: string; amount: string };
