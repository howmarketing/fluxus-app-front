/* eslint-disable no-return-await */
/* eslint-disable camelcase */
import { toPrecision } from '@utils/numbers';
import { BigNumber } from 'bignumber.js';
import moment from 'moment';
import { getWallet } from './near';
import getConfig from './config';

const config = getConfig();
const api_url = 'https://rest.nearapi.org/view';

export interface RefPrice {
	price: string;
}

export interface PoolRPCView {
	id: number;
	token_account_ids: string[];
	token_symbols: string[];
	amounts: string[];
	total_fee: number;
	shares_total_supply: string;
	tvl: number;
	token0_ref_price: string;
	share: string;
}

export const parsePoolView = (pool: any): PoolRPCView => ({
	id: Number(pool.id),
	token_account_ids: pool.token_account_ids,
	token_symbols: pool.token_symbols,
	amounts: pool.amounts,
	total_fee: pool.total_fee,
	shares_total_supply: pool.shares_total_supply,
	tvl: Number(toPrecision(pool.tvl, 2)),
	token0_ref_price: pool.token0_ref_price,
	share: pool.share,
});

export const getPoolBalance = async (pool_id: number) => {
	console.log('getPoolBalance: wallet accound id: ', getWallet().getAccountId());
	return await fetch(api_url, {
		method: 'POST',
		body: JSON.stringify({
			rpc_node: config.nodeUrl,
			contract: config.REF_FI_CONTRACT_ID,
			method: 'get_pool_shares',
			params: { account_id: getWallet().getAccountId(), pool_id },
		}),
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.text())
		.then(balance => new BigNumber(balance.toString()).toFixed());
};

export const getPoolsBalances = async (pool_ids: number[]) =>
	await Promise.all(pool_ids.map(async pool_id => await getPoolBalance(Number(pool_id))));

export const getPools = async (counter: number) =>
	await fetch(api_url, {
		method: 'POST',
		body: JSON.stringify({
			rpc_node: config.nodeUrl,
			contract: config.REF_FI_CONTRACT_ID,
			method: 'get_pools',
			params: { from_index: counter, limit: 300 },
		}),
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(pools => {
			pools.forEach(async (pool: any, i: number) => {
				pool.id = i + counter;
				const pool_balance = await getPoolBalance(Number(pool.id) + counter);
				if (Number(pool_balance) > 0) {
					pools[i].share = pool_balance;
				}
			});
			return pools;
		});

export type IPoolHistoryFiatPrice = {
	pool_id: string;
	asset_amount: string;
	fiat_amount: string;
	asset_price: string;
	fiat_price: string;
	asset_tvl: string;
	fiat_tvl: string;
	date: string;
};
export const getPoolTvlFiatPriceHistory = async ({ pool_id = 0 }): Promise<Array<IPoolHistoryFiatPrice>> => {
	const enpointUrl = `https://sodaki.com/api/pool/${pool_id}/tvl`;

	const fetchResponse = await fetch(enpointUrl, {
		headers: {
			accept: '*/*',
			'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
			'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'cross-site',
		},
		referrerPolicy: 'strict-origin-when-cross-origin',
		body: null,
		method: 'GET',
		mode: 'cors',
		credentials: 'omit',
	});

	return fetchResponse.json();
};
export interface IPoolFiatPrice {
	amounts: string[];
	amp: number;
	farming: boolean;
	id: number;
	pool_kind: string;
	shares_total_supply: string;
	token0_ref_price: string;
	token_account_ids: string[];
	token_symbols: string[];
	total_fee: number;
	tvl: number;
	shareSupply: any;
}
export const getPoolTvlFiatPrice = async ({ pool_id = 0 }): Promise<IPoolFiatPrice> => {
	const enpointUrl = `https://dev-indexer.ref-finance.com/get-pool?pool_id=${pool_id}`;

	const fetchResponse = await fetch(enpointUrl, {
		headers: {
			accept: '*/*',
			'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
			'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'cross-site',
		},
		referrerPolicy: 'strict-origin-when-cross-origin',
		body: null,
		method: 'GET',
		mode: 'cors',
		credentials: 'omit',
	});

	return fetchResponse.json();
};
export const getUserWalletTokens = async (): Promise<any> =>
	await fetch(`${config.helperUrl}/account/${getWallet().getAccountId()}/likelyTokens`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(tokens => tokens);

export const getCurrentUnixTime = async (): Promise<any> =>
	await fetch(`${config.indexerUrl}/timestamp`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(ts => ts.ts)
		.catch(() => moment().unix());

export const currentRefPrice = async (): Promise<any> =>
	await fetch(`${config.indexerUrl}/get-token-price?token_id=token.v2.ref-finance.near`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(priceBody => priceBody.price)
		.catch(() => '-');

export const currentTokensPrice = async (ids: string): Promise<any> =>
	await fetch(`${config.indexerUrl}/list-token-price-by-ids?ids=${ids}`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(priceBody => priceBody)
		.catch(() => []);
