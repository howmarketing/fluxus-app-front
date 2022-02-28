/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
import BN from 'bn.js';
import * as math from 'mathjs';
import { TokenMetadata } from '@ProviderPattern/models/Actions/AbstractMainFTContractProviderAction';
import { Pool } from '@ProviderPattern/models/Actions/AbstractMainPoolProviderAction';

const BPS_CONVERSION = 10000;

const ROUNDING_OFFSETS: BN[] = [];
const BN10 = new BN(10);
for (let i = 0, offset = new BN(5); i < 24; i++, offset = offset.mul(BN10)) {
	ROUNDING_OFFSETS[i] = offset;
}

export const sumBN = (...args: string[]): string => args.reduce((acc, n) => acc.add(new BN(n)), new BN(0)).toString();

/**
 * @description Give a integer token value representation and get back a fractionarity token value representation as string.
 * @param {number} decimals
 * @param {string} number
 * @returns {string} string representation of a fractionary number
 */
export const toReadableNumber = (decimals: number, number: string = '0', debug = false): string => {
	if (!decimals) return number;

	const wholeStr = number.substring(0, number.length - decimals) || '0';
	const fractionStr = number
		.substring(number.length - decimals)
		.padStart(decimals, '0')
		.substring(0, decimals);
	if (debug) {
		console.log({
			decimals,
			number,
			wholeStr,
			fractionStr,
			result: `${wholeStr}.${fractionStr}`.replace(/\.?0+$/, ''),
		});
	}
	return `${wholeStr}.${fractionStr}`.replace(/\.?0+$/, '');
};

/**
 * @description The same as toReadableNumber function but with a more friendly identification name representating the behaivor of the function.
 * 		- Give a integer token value representation and get back a fractionarity token value representation as string.
 * @param {number} decimals
 * @param {string} number
 * @returns {string} string representation of a fractionary number
 */
export const transformTokenIntegerValueToFractionaryTokenValueRepresentation = (
	decimals: number,
	number: string = '0',
): string => toReadableNumber(decimals, number);

/**
 * @description Give a fractionarity token value and get back a integer token value representation as string.
 * @param {number} decimals
 * @param {string} number
 * @returns {string} string representation of a non fractionary number
 */
export const toNonDivisibleNumber = (decimals: number, number: string): string => {
	if (decimals === null || decimals === undefined) return number;
	const [wholePart, fracPart = ''] = `${number}`.split('.');

	return `${wholePart}${fracPart.padEnd(decimals, '0').slice(0, decimals)}`.replace(/^0+/, '').padStart(1, '0');
};

/**
 * @description The same as toNonDivisibleNumber function but with a more friendly identification name representating the behaivor of the function.
 * 		- Give a fractionarity token value and get back a integer token value representation as string.
 * @param {number} decimals
 * @param {string} number
 * @returns {string} string representation of a non fractionary number
 */
export const transformTokenFractionValueToIntegerTokenValueRepresentation = (
	decimals: number,
	number: string = '0',
): string => toNonDivisibleNumber(decimals, number);

export const toPrecision = (
	number: string,
	precision: number,
	withCommas: boolean = false,
	atLeastOne: boolean = true,
): string => {
	const [whole, decimal = ''] = number.split('.');

	let str = `${withCommas ? formatWithCommas(whole) : whole}.${decimal.slice(0, precision)}`.replace(/\.$/, '');
	if (atLeastOne && Number(str) === 0 && str.length > 1) {
		const n = str.lastIndexOf('0');
		str = str.slice(0, n) + str.slice(n).replace('0', '1');
	}

	return str;
};

export const toRoundedReadableNumber = ({
	decimals,
	number,
	precision = 6,
	withCommas = true,
}: {
	decimals: number;
	number?: string;
	precision?: number;
	withCommas?: boolean;
}): string => toPrecision(toReadableNumber(decimals, number), precision, withCommas);

export const convertToPercentDecimal = (percent: number) => math.divide(percent, 100);

export const calculateFeePercent = (fee: number) => math.divide(fee, 100);

export const calculateFeeCharge = (fee: number, total: string) =>
	math.round(math.evaluate(`(${fee} / ${BPS_CONVERSION}) * ${total}`), 2);

export const calculatePriceImpact = (
	pool: Pool,
	tokenIn: TokenMetadata,
	tokenOut: TokenMetadata,
	tokenInAmount: string,
) => {
	const in_balance = toReadableNumber(tokenIn.decimals, pool.supplies[tokenIn.id]);
	const out_balance = toReadableNumber(tokenOut.decimals, pool.supplies[tokenOut.id]);

	const constant_product = math.evaluate(`${in_balance} * ${out_balance}`);

	const marketPrice = math.evaluate(`(${in_balance} / ${out_balance})`);

	const new_in_balance = math.evaluate(`${tokenInAmount} + ${in_balance}`);

	const new_out_balance = math.divide(constant_product, new_in_balance);

	const tokenOutReceived = math.subtract(math.evaluate(out_balance), new_out_balance);

	const newMarketPrice = math.evaluate(`${tokenInAmount} / ${tokenOutReceived}`);

	const PriceImpact = percent(subtraction(newMarketPrice, marketPrice), marketPrice).toString();

	return PriceImpact;
};

export const calculateExchangeRate = (fee: number, from: string, to: string) =>
	math.round(math.evaluate(`${to} / ${from}`), 4);

export const subtraction = (initialValue: string, toBeSubtract: string) =>
	math.format(math.evaluate(`${initialValue} - ${toBeSubtract}`), {
		notation: 'fixed',
	});

export const percentOf = (percent: number, num: number | string) =>
	math.evaluate(`${convertToPercentDecimal(percent)} * ${num}`);

export const percentLess = (percent: number, num: number | string) =>
	math.format(math.evaluate(`${num} - ${percentOf(percent, num)}`), {
		notation: 'fixed',
	});

export function formatWithCommas(value: string): string {
	const pattern = /(-?\d+)(\d{3})/;
	while (pattern.test(value)) {
		value = value.replace(pattern, '$1,$2');
	}
	return value;
}

export const percent = (numerator: string, denominator: string) =>
	math.evaluate(`(${numerator} / ${denominator}) * 100`);

export const calculateFairShare = ({
	shareOf,
	contribution,
	totalContribution,
}: {
	shareOf: string;
	contribution: string;
	totalContribution: string;
}) =>
	math.format(math.evaluate(`(${shareOf} * ${contribution}) / ${totalContribution}`), {
		notation: 'fixed',
		precision: 0,
	});

export const toInternationalCurrencySystem = (labelValue: string, percent?: number) =>
	Math.abs(Number(labelValue)) >= 1.0e9
		? `${(Math.abs(Number(labelValue)) / 1.0e9).toFixed(percent || 2)}B`
		: Math.abs(Number(labelValue)) >= 1.0e6
		? `${(Math.abs(Number(labelValue)) / 1.0e6).toFixed(percent || 2)}M`
		: Math.abs(Number(labelValue)) >= 1.0e3
		? `${(Math.abs(Number(labelValue)) / 1.0e3).toFixed(percent || 2)}K`
		: Math.abs(Number(labelValue)).toFixed(percent || 2);
