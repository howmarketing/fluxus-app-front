export const NEAR_FIAT_PRICE_URL =
	'https://api.coingecko.com/api/v3/simple/price?include_last_updated_at=true&vs_currencies=usd%2Ceur%2Ccny&ids=near'; // 'https://helper.testnet.near.org/fiat'

export type INearPriceResponse = {
	usd: number;
	eur: number;
	cny: number;
	lastUpdatedAt: number;
};
export async function getNearPrice(): Promise<INearPriceResponse | null> {
	try {
		const { success, msg, response, body } = await sendJson({
			method: 'GET',
			url: NEAR_FIAT_PRICE_URL,
		});
		if (!success) {
			console.log({ success, msg, response, body });
			return null;
		}
		const { usd, eur, cny } = response.near;
		return { usd, eur, cny, lastUpdatedAt: response.near.last_updated_at };
	} catch (e: any) {
		console.log(e);
		return null;
	}
}

export type ISendJsonResponse = {
	success: boolean;
	msg: string;
	body: any;
	response: any;
};
export async function sendJson({ method = 'GET', url = '', json = {} }): Promise<ISendJsonResponse> {
	const bodySent = method !== 'GET' ? JSON.stringify(json) : undefined;
	const response = await fetch(url, {
		method,
		body: bodySent,
		headers: { 'Content-type': 'application/json; charset=utf-8' },
	});
	if (!response.ok) {
		const body = await response.text();
		let parsedBody: Record<any, any> | string | undefined = '';

		try {
			parsedBody = JSON.parse(body);
		} catch (e: any) {
			parsedBody = {
				body_text: parsedBody,
				body_parse_error: e?.message || 'unknow',
			};
		}
		return {
			success: false,
			msg: `Fetch error`,
			response: {},
			body: parsedBody,
		};
	}
	if (response.status === 204) {
		// No Content
		return {
			success: false,
			msg: `Fetch response null`,
			response: {},
			body: bodySent,
		};
	}
	const responseJson = await response.json();
	return {
		success: true,
		msg: `Fetch response success`,
		response: responseJson,
		body: bodySent,
	};
}
