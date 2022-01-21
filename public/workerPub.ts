/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
import { keyStores, Near } from 'near-api-js';
import { TokenMetadata } from '@services/ft-contract';
import { Farm } from '@services/farm';
import getConfig from '@services/config';
import db, { FarmDexie } from '@store/RefDatabase';

const config = getConfig('testnet');

const MAX_PER_PAGE = 100;

const near = new Near({
	keyStore: new keyStores.InMemoryKeyStore(),
	...config,
});

const view = ({ methodName, args = {} }: { methodName: string; args?: object }) =>
	near.connection.provider
		.query({
			request_type: 'call_function',
			finality: 'final',
			account_id: config.REF_FI_CONTRACT_ID,
			method_name: methodName,
			args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
		})
		.then(res => {
			const indexResult = 'result' as any;
			return JSON.parse(Buffer.from(res[indexResult]).toString());
		});

const farmView = ({ methodName, args = {} }: { methodName: string; args?: object }) =>
	near.connection.provider
		.query({
			request_type: 'call_function',
			finality: 'final',
			account_id: config.REF_FARM_CONTRACT_ID,
			method_name: methodName,
			args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
		})
		.then(res => {
			const indexResult = 'result' as any;
			return JSON.parse(Buffer.from(res[indexResult]).toString());
		});

const getTotalPools = () => view({ methodName: 'get_number_of_pools' });

const getPools = (page: number) => {
	const index = (page - 1) * MAX_PER_PAGE;

	return view({
		methodName: 'get_pools',
		args: { from_index: index, limit: MAX_PER_PAGE },
	});
};

interface PoolVolumes {
	[tokenId: string]: { input: string; output: string };
}
export interface Pool {
	id: number;
	tokenIds: string[];
	supplies: { [key: string]: string };
	fee: number;
	shareSupply: string;
	tvl: number;
	token0_ref_price: string;
}
export type PoolDetails = Pool & { volumes: PoolVolumes };

export const getPoolDetails = async (id: number): Promise<PoolDetails> =>
	view({
		methodName: 'get_pool_volumes',
		args: { pool_id: id },
	});

const getTokens = async () =>
	fetch(`${config.indexerUrl}/list-token`, {
		method: 'GET',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
	})
		.then(res => res.json())
		.then(tokens => tokens);

const getFarms = (page: number) => {
	const index = (page - 1) * MAX_PER_PAGE;

	return farmView({
		methodName: 'list_farms',
		args: { from_index: index, limit: MAX_PER_PAGE },
	});
};

const cachePools = async () => {
	const totalPools = await getTotalPools();
	const pages = Math.ceil(totalPools / MAX_PER_PAGE);
	for (let page = 1; page <= pages; page += 1) {
		const pools = await getPools(page);
		await db.pools.bulkPut(
			pools.map(
				(
					pool: {
						token_account_ids: any[];
						amounts: any[];
						total_fee: any;
						shares_total_supply: any;
					},
					i: number,
				) => ({
					id: (page - 1) * MAX_PER_PAGE + i,
					token1Id: pool.token_account_ids[0],
					token2Id: pool.token_account_ids[1],
					token1Supply: pool.amounts[0],
					token2Supply: pool.amounts[1],
					fee: pool.total_fee,
					shares: pool.shares_total_supply,
				}),
			),
		);
	}
};

const cacheTokens = async () => {
	const tokens = await getTokens();
	const tokenArr = Object.keys(tokens).map(key => ({
		id: key,
		icon: tokens[key].icon,
		decimals: tokens[key].decimals,
		name: tokens[key].name,
		symbol: tokens[key].symbol,
	}));
	await db.tokens.bulkPut(
		tokenArr.map((token: TokenMetadata) => ({
			id: token.id,
			name: token.name,
			symbol: token.symbol,
			decimals: token.decimals,
			icon: token.icon,
		})),
	);
};

const cacheFarmPools = async () => {
	const farms: Farm[] = await getFarms(1);
	const farmsArr = Object.keys(farms).map(key => ({
		id: key,
		pool_id: farms[Number(key)].farm_id.slice(
			farms[Number(key)].farm_id.indexOf('@') + 1,
			farms[Number(key)].farm_id.lastIndexOf('#'),
		),
		status: farms[Number(key)].farm_status,
	}));
	await db.farms.bulkPut(
		farmsArr.map((farm: FarmDexie) => ({
			id: farm.id,
			pool_id: farm.pool_id,
			status: farm.status,
		})),
	);
};
runWorker();

type getPoolResponse = {
	token_account_ids: any[];
	amounts: any[];
	total_fee: any;
	shares_total_supply: any;
};
export async function runWorker() {
	return new Promise(async (resolve, reject) => {
		// Will have return values in the future.
		await cachePools();
		const pools = await (async () =>
			(async ($page?: number | undefined) => {
				const page = $page || 1;
				const pools = (await getPools(page)) as Array<getPoolResponse>;
				if (page < 10) {
					const nextsPagePools = (await getPools(page + 1)) as Array<getPoolResponse>;
					return pools.concat(nextsPagePools);
				}
				return pools;
			})())();

		await cacheTokens();
		const tokensE = (await getTokens()) as Record<any, any>;
		const tokens = Object.keys(tokensE).map(key => ({
			id: key,
			icon: tokensE[key].icon,
			decimals: tokensE[key].decimals,
			name: tokensE[key].name,
			symbol: tokensE[key].symbol,
		})) as Array<TokenMetadata>;

		await cacheFarmPools();
		const farms = (await (async () =>
			(async ($page?: number | undefined) => {
				const page = $page || 1;
				const items = (await getFarms(page)) as Array<Farm>;
				if (page < 10) {
					const nextPageItems = (await getFarms(page + 1)) as Array<Farm>;
					return items.concat(nextPageItems);
				}
				return items;
			})())()) as Array<Farm>;

		resolve({ pools, tokens, farms });
	}).then(workers => {
		console.log('============== Start to run worker file ===============');
		console.log(workers);
		console.log('============== Stop to run worker file ===============');
	});
}

onmessage = function (e) {
	console.log('TS Worker: Message received from main script');
	const result = e.data[0] * e.data[1];
	if (Number.isNaN(result)) {
		postMessage('TS - Please write two numbers');
	} else {
		const workerResult = `Result: ${result}`;
		console.log('TS Worker: Posting message back to main script');
		postMessage(workerResult);
	}
};
