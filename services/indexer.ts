/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import moment from 'moment/moment';
import { parseAction } from '@services/transaction';
import getConfig from './config';
import { getWallet } from './near';
import { parsePoolView, PoolRPCView } from './api';

const config = getConfig();

export const get24hVolume = async (pool_id: string): Promise<string> =>
	fetch(`${config.sodakiApiUrl}/pool/${pool_id}/rolling24hvolume/sum`, {
		method: 'GET',
	})
		.then(res => res.json())
		.then(monthTVL => monthTVL.toString());

const parseActionView = async (action: any) => {
	const data = await parseAction(action[3], action[4], action[2]);
	return {
		datetime: moment.unix(action[0] / 1000000000),
		txUrl: `${config.explorerUrl}/transactions/${action[1]}`,
		data,
		// status: action[5] === 'SUCCESS_VALUE',
		status: action[6] && action[6].indexOf('SUCCESS') > -1,
	};
};

export const getYourPools = async (): Promise<PoolRPCView[]> =>
	fetch(`${config.indexerUrl}/liquidity-pools/${getWallet().getAccountId()}`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(pools => pools);

export const getTopPools = async (args: any): Promise<PoolRPCView[]> =>
	fetch(`${config.indexerUrl}/list-top-pools`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(pools => {
			pools = pools.map((pool: any) => parsePoolView(pool));
			return _order(args, _search(args, pools));
		})
		.catch(() => []);

export const getPool = async (pool_id: string): Promise<PoolRPCView> =>
	fetch(`${config.indexerUrl}/get-pool?pool_id=${pool_id}`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(pool => parsePoolView(pool));

export const getPoolsByIds = async ({ pool_ids }: { pool_ids: string[] }): Promise<PoolRPCView[]> => {
	const ids = pool_ids.join('|');
	return fetch(`${config.indexerUrl}/list-pools-by-ids?ids=${ids}`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(pools => {
			pools = pools.map((pool: any) => parsePoolView(pool));
			return pools;
		})
		.catch(() => []);
};

export const getTokenPriceList = async (): Promise<any> =>
	fetch(`${config.indexerUrl}/list-token-price`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(list => list);

const _search = (args: any, pools: PoolRPCView[]) => {
	if (args.tokenName === '') return pools;
	return _.filter(
		pools,
		(pool: PoolRPCView) =>
			_.includes(pool.token_symbols[0].toLowerCase(), args.tokenName.toLowerCase()) ||
			_.includes(pool.token_symbols[1].toLowerCase(), args.tokenName.toLowerCase()),
	);
};

const _order = (args: any, pools: PoolRPCView[]) => {
	let column = args.column || 'tvl';
	const order = args.order || 'desc';
	column = args.column === 'fee' ? 'total_fee' : column;
	return _.orderBy(pools, [column], [order]);
};

const _pagination = (args: any, pools: PoolRPCView[]) =>
	_.slice(pools, (args.page - 1) * args.perPage, args.page * args.perPage);

export type ActionData = Awaited<ReturnType<typeof parseActionView>>;

type Awaited<T> = T extends Promise<infer P> ? P : never;

export const getLatestActions = async (): Promise<Array<ActionData>> =>
	fetch(`${config.indexerUrl}/latest-actions/${getWallet().getAccountId()}`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(items => {
			const tasks = items.map(async (item: any) => parseActionView(item));
			return Promise.all(tasks);
		});
