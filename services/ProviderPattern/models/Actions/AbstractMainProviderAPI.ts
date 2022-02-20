import ProviderPattern from '@ProviderPattern/index';
import { UtilParser_RecursiveParseJson } from '@utils/parser';

export default class AbstractMainProviderAPI {
	protected static _instance: AbstractMainProviderAPI;

	protected declare endpointUrl: string;

	private constructor() {
		this.setUp();
	}

	public static getInstance(): AbstractMainProviderAPI {
		if (this._instance) return this._instance;
		this._instance = new this();
		this._instance.setUp();
		return this._instance;
	}

	private setUp(): void {
		this.endpointUrl = ProviderPattern.getProviderInstance().getConnectionConfigData().fluxusApiUrl || '-';
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
