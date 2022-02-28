/* eslint-disable no-return-await */
/* eslint-disable camelcase */
import { toPrecision } from '@utils/numbers';
import { BigNumber } from 'bignumber.js';
import moment from 'moment';
import ProviderPattern from '@ProviderPattern/index';
import { UtilParser_RecursiveParseJson } from '@utils/parser';
import AbstractGenericActions from './AbstractGenericActions';
import AbstractMainProviderActions from './AbstractMainProviderActions';

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

export default class AbstractMainProviderAPI extends AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AbstractMainProviderAPI;

	protected declare _providerActionsInstace: AbstractMainProviderActions;

	protected declare endpointUrl: string;

	/**
	 * GET THE SINGLETON INSTANCE OF THIS CLASS
	 */
	public static getInstance(providerActionsInstance: AbstractMainProviderActions) {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton._setUp(providerActionsInstance);
		return this._classInstanceSingleton;
	}

	protected _setUp(providerActionsInstance: AbstractMainProviderActions): void {
		this.setUp(providerActionsInstance);
		this.endpointUrl = ProviderPattern.getProviderInstance().getConnectionConfigData().fluxusApiUrl || '-';
	}

	/**
	 * GET THE PROVICER ACTIONS INSTACE
	 */
	public getProviderActionsInstace() {
		return this._providerActionsInstace;
	}

	/**
	 * GET THE TOKEN ACTIONS INSTACE
	 */
	protected getTokenActionsInstance() {
		return this.getProviderActionsInstace().getTokenActions();
	}

	/**
	 * GET THE ACCOUNT ACTIONS INSTACE
	 */
	protected getAccountActionsInstance() {
		return this.getProviderActionsInstace().getAccountActions();
	}

	/**
	 * GET THE VAULTS ACTIONS INSTACE
	 */
	protected getVaultsActionsInstance() {
		return this.getProviderActionsInstace().getVaultActions();
	}

	/**
	 * GET THE FT CONTRACT ACTIONS INSTACE
	 */
	protected getFTContractActionsInstance() {
		return this.getProviderActionsInstace().getFTContractActions();
	}

	public parsePoolView(pool: any): PoolRPCView {
		this.devImplementation = true;
		return {
			id: Number(pool.id),
			token_account_ids: pool.token_account_ids,
			token_symbols: pool.token_symbols,
			amounts: pool.amounts,
			total_fee: pool.total_fee,
			shares_total_supply: pool.shares_total_supply,
			tvl: Number(toPrecision(pool.tvl, 2)),
			token0_ref_price: pool.token0_ref_price,
			share: pool.share,
		};
	}

	public async getPoolBalance(pool_id: number) {
		this.devImplementation = true;
		console.log('getPoolBalance: wallet accound id: ', this.getWallet().getAccountId());
		return await fetch(api_url, {
			method: 'POST',
			body: JSON.stringify({
				rpc_node: this.getProviderConfigData().nodeUrl,
				contract: this.getProviderConfigData().REF_FI_CONTRACT_ID,
				method: 'get_pool_shares',
				params: { account_id: this.getWallet().getAccountId(), pool_id },
			}),
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		})
			.then(res => res.text())
			.then(balance => new BigNumber(balance.toString()).toFixed());
	}

	public async getPoolsBalances(pool_ids: number[]) {
		this.devImplementation = true;
		const a = '';
		return await Promise.all(pool_ids.map(async pool_id => await this.getPoolBalance(Number(pool_id))));
	}

	public async getPools(counter: number) {
		this.devImplementation = true;
		const a = '';
		return await fetch(api_url, {
			method: 'POST',
			body: JSON.stringify({
				rpc_node: this.getProviderConfigData().nodeUrl,
				contract: this.getProviderConfigData().REF_FI_CONTRACT_ID,
				method: 'get_pools',
				params: { from_index: counter, limit: 300 },
			}),
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		})
			.then(res => res.json())
			.then(pools => {
				pools.forEach(async (pool: any, i: number) => {
					pool.id = i + counter;
					const pool_balance = await this.getPoolBalance(Number(pool.id) + counter);
					if (Number(pool_balance) > 0) {
						pools[i].share = pool_balance;
					}
				});
				return pools;
			});
	}

	public async getPoolTvlFiatPriceHistory({ pool_id = 0 }): Promise<Array<IPoolHistoryFiatPrice>> {
		this.devImplementation = true;
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
	}

	public async getPoolTvlFiatPrice({ pool_id = 0 }): Promise<IPoolFiatPrice> {
		this.devImplementation = true;
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
	}

	public async getUserWalletTokens(): Promise<any> {
		this.devImplementation = true;
		const a = '';
		return await fetch(
			`${this.getProviderConfigData().helperUrl}/account/${this.getWallet().getAccountId()}/likelyTokens`,
			{
				method: 'GET',
				headers: { 'Content-type': 'application/json; charset=UTF-8' },
			},
		)
			.then(res => res.json())
			.then(tokens => tokens);
	}

	public async getCurrentUnixTime(): Promise<any> {
		this.devImplementation = true;
		const a = '';
		return await fetch(`${this.getProviderConfigData().indexerUrl}/timestamp`, {
			method: 'GET',
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		})
			.then(res => res.json())
			.then(ts => ts.ts)
			.catch(() => moment().unix());
	}

	public async currentRefPrice(): Promise<any> {
		this.devImplementation = true;
		const a = '';
		return await fetch(
			`${this.getProviderConfigData().indexerUrl}/get-token-price?token_id=token.v2.ref-finance.near`,
			{
				method: 'GET',
				headers: { 'Content-type': 'application/json; charset=UTF-8' },
			},
		)
			.then(res => res.json())
			.then(priceBody => priceBody.price)
			.catch(() => '-');
	}

	public async currentTokensPrice(ids: string): Promise<any> {
		this.devImplementation = true;
		const a = '';
		return await fetch(`${this.getProviderConfigData().indexerUrl}/list-token-price-by-ids?ids=${ids}`, {
			method: 'GET',
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		})
			.then(res => res.json())
			.then(priceBody => priceBody)
			.catch(() => []);
	}

	public getEndpointUrl() {
		return this.endpointUrl;
	}

	public async createGraphQlQuery({
		operationName = 'createVaultRecorder',
		queryType = 'mutation',
		variables = {},
		data = {},
	}): Promise<{
		queryBuilderObj: { operationName: string; variables: {}; query: string };
		queryBuildBaseJson: string;
		queryBuildBase: any;
	}> {
		const parseToJson = (dataToParse: Array<any> | Record<any, any>): string => {
			try {
				const responseJson = JSON.stringify(dataToParse);
				return responseJson;
			} catch (e: any) {
				return e?.message || 'unknow stringify json error';
			}
		};
		const url = this.getEndpointUrl();
		const dataAttributes = await AbstractMainProviderAPI.getGraphQlDataAttributes(data);
		const query: string = `${queryType} ${operationName} {
   ${operationName}(
     data: ${parseToJson(data)}
   )  {
        ${dataAttributes}
       }
}`;
		const replaceQueryTag = '#replace_query#';
		const queryBuilder = `{ "operationName":"${operationName}","variables":"{}","query":
     "${replaceQueryTag}"
}`;
		const queryBuilderObj = JSON.parse(queryBuilder);
		queryBuilderObj.query = queryBuilderObj.query.replace(replaceQueryTag, query);
		const queryBuildBaseJson = parseToJson(queryBuilderObj);
		const queryBuildBase: string = JSON.parse(queryBuildBaseJson);
		return { queryBuilderObj, queryBuildBaseJson, queryBuildBase };
	}

	public getFetchGraphQlBase({
		account_id = '',
		request_type = '',
		contract_id = '',
		function_name = '',
		function_args = '',
		amount = '',
		transaction_id = '',
		request_extra_data = '',
	}): [
		string,
		{
			headers: Record<any, any>;
			referrerPolicy: string;
			body: string;
			method: string;
			mode: string;
			credentials: string;
		},
	] {
		const url = this.endpointUrl;
		const options = {
			headers: {
				accept: '*/*',
				'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
				'content-type': 'application/json',
				'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
			},
			referrerPolicy: 'no-referrer',
			body: `{"operationName":"createVaultRecorder","variables":{},"query":"mutation createVaultRecorder {\\n  createVaultRecorder(\\n    data: {account_id: \\"${account_id}\\", request_type: ${request_type}, contract_id: \\"${contract_id}\\", function_name: \\"${function_name}\\", function_args: \\"${function_args}\\", amount: \\"${amount}\\", transaction_id: \\"${transaction_id}\\", request_extra_data: \\"${request_extra_data}\\", publishedAt: \\"2022-02-11T13:10:20Z\\"}\\n  ) {\\n    data {\\n      attributes {\\n        account_id: account_id\\n        request_type: request_type\\n        contract_id: contract_id\\n        function_name: function_name\\n        function_args: function_args\\n        amount: amount\\n        transaction_id: transaction_id\\n        request_extra_data: request_extra_data\\n        publishedAt: publishedAt\\n      }\\n    }\\n  }\\n}\\n"}`,
			method: 'POST',
			mode: 'cors',
			credentials: 'omit',
		};

		return [url, options];
	}

	public static async getGraphQlDataAttributes(
		attributes: Record<string, any>,
		addScapeToValue = false,
		scapeValueSymbol = '#',
	): Promise<string> {
		const scapeSymbol = addScapeToValue ? scapeValueSymbol : '';
		let stringAttributes: string = ``;
		Object.keys(attributes).map((attributeKey, index: number) => {
			stringAttributes += `${attributeKey}: ${scapeSymbol}${attributeKey}${scapeSymbol}
                `;
			return null;
		});
		let stringDataAttributes: string = ``;
		stringDataAttributes += `data {
            attributes {`;
		stringDataAttributes += stringAttributes;
		stringDataAttributes += `
            } }`;
		return stringDataAttributes;
	}

	public static getDevelopmentHelperToFastImplementFeature() {
		return APIDevelopmentHelperToFastImplementFeature;
	}
}

/**
 * WILL BE REMOVED AFTER FINISH IMPLEMENTATION
 * @description That is an hybrid way to work while some features are develope
 */
export const APIDevelopmentHelperToFastImplementFeature = {
	jsonParseRecursively: UtilParser_RecursiveParseJson,
	async createVaultRecorderGraphQlQuery() {
		const $this = this;
		// (1) - Define relationship 1/N
		const [function_view, function_call] = ['function_view', 'function_call'];

		// (2) - Define object data to record
		const anyObj = {
			account_id: 'leopolluuummm.testnet',
			request_type: function_view,
			contract_id: 'graql.contract_id',
			function_name: 'some function',
			function_args: '{"Some_args":"with values"}',
			amount: `1234567890123456789012345`,
			transaction_id: 'xxxxx',
			request_extra_data: '{"all_json_data":"stringifyed"}',
			publishedAt: '2022-02-11T13:10:20Z',
		};

		// (3) - Make the object data a json string
		const anyJson = JSON.stringify(anyObj);

		// (4) - Define recorder data to query
		const dataRecord = `mutation createVaultRecorder {
  createVaultRecorder(
    data: ${anyJson}
  ) {
    data {
      attributes {
        account_id: account_id
        request_type: request_type
        contract_id: contract_id
        function_name: function_name
        function_args: function_args
        amount: amount
        transaction_id: transaction_id
        request_extra_data: request_extra_data
        publishedAt: publishedAt
      }
    }
  }
}`;

		// (5) - Define the object query base
		const stringJsons = JSON.stringify({ operationName: 'createVaultRecorder', variables: {}, query: dataRecord });
		// Let parsedData to be parsed and changed
		let parsedData = {};
		// After initialize all logic scripts, make a log to test the response data
		const anyParsedJsonToObj = await $this.jsonParseRecursively(anyJson);
		parsedData = await $this.jsonParseRecursively(stringJsons);

		console.log('anyParsedJsonToObj: ', anyParsedJsonToObj);
		console.log('anyParsedJsonToObjAsJson: ', JSON.stringify(anyParsedJsonToObj));

		console.log('parsedData: ', parsedData);
	},
};
