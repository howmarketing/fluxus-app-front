import React from 'react';
import useSWR from 'swr';
import CryptoJS from 'crypto-js';
import SHA1 from 'crypto-js/sha1';
import { isNull } from 'lodash';

type IUseSWRFunction<Data = any> = {
	endpoint: string;
	functionToExec: (params?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => Promise<any>;
	argsToExecFunction: Record<any, any> | Array<any>;
	inUseState?: any | undefined;
	settableInUseState?: (value: React.SetStateAction<Data>) => void | undefined;
};
type IUseSWRFunctionResponse<Data = any, Error = any> = {
	requested_in: string;
	endpoint: string;
	data_is_diff?: boolean | undefined;
	compare_data: { data: Data | undefined; left_hash: string | undefined; right_hash: string | undefined };
	data_setted_to_inUseState?: boolean | undefined;
	data: Data | undefined;
	has_stored_new_data: boolean;
	error: Error | undefined;
};
export function useSWRFunction<Data = any, Error = any>(
	params: IUseSWRFunction<Data>,
): IUseSWRFunctionResponse<Data, Error> {
	const { endpoint, functionToExec, argsToExecFunction, inUseState, settableInUseState } = params;
	const dateTime = new Date(Date.now());
	const requestedIn = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
	const { data, error } = useSWR<Data, Error>(
		endpoint,
		async url => {
			const args = Array.isArray(argsToExecFunction) ? argsToExecFunction : [argsToExecFunction];
			const data = await functionToExec(...args);
			return data;
		},
		{ refreshInterval: 120000, revalidateIfStale: false },
	);
	const response = {
		requested_in: requestedIn,
		endpoint,
		data,
		has_stored_new_data: false,
		error,
	} as IUseSWRFunctionResponse<Data, Error>;

	// If did not received any data from SWR request, try to get SWR data from localStorage,.
	if (!data) {
		response.data = getSWRStorage(response).data;
	}
	// If identifyed the in use state, verify if the SWR data is an update value (is if different and it is not null, so we have an update value in data)
	if (inUseState && !isNull(response.data)) {
		const { is_diff, left_hash, right_hash } = compareAsHash(inUseState, response.data);
		response.data_is_diff = is_diff;
		response.compare_data = { data: inUseState, left_hash, right_hash };
		if (settableInUseState) {
			try {
				if (!response.data_is_diff) {
					throw new Error(
						'In use state and SWR data must to be different to set a new value to these state ',
					);
				}
				if (!response.data) {
					throw new Error('could not define an undefined value');
				}
				response.data_setted_to_inUseState = true;
				settableInUseState(response.data);
			} catch (e) {
				response.data_setted_to_inUseState = false;
			}
		}
	}
	// If SWR did not received any data, and the localStorage data value is null, do not modify the identifyed in use state
	if (!isNull(response.data)) {
		response.has_stored_new_data = true;
		setSWRStorage(response);
	}
	console.log(`SWR DATA (${requestedIn}): `, response);
	return response;
}
/**
 * GET THE IF EXISTENT, SWR RESPONSE FOR THE ENTRIE ENDPOINT
 */
const getSWRStorage = (props: IUseSWRFunctionResponse) => {
	const { requested_in, endpoint, data, error } = props;
	let item = {} as IUseSWRFunctionResponse;
	try {
		const itemJson = localStorage.getItem(`SWR-Storage:${endpoint}`);
		if (itemJson) {
			item = JSON.parse(itemJson);
		}
	} catch (e: any) {
		console.error(e);
	}
	return { requested_in, endpoint, data: item?.data, error };
};

/**
 * DEFINE TO BE ALWAYS AVAILABLE DATA TO SWR RESPONSE INTO LOCALSTORAGE FOR THE ENTRIE ENDPOINT
 */
const setSWRStorage = (props: IUseSWRFunctionResponse) => {
	try {
		const { requested_in, endpoint, data } = props;
		localStorage.setItem(`SWR-Storage:${endpoint}`, JSON.stringify({ requested_in, endpoint, data }));
	} catch (e: any) {
		console.error(e);
	}
};
const compareAsHash = (leftData: any, rightData: any) => {
	const leftDataSHA1 = encryptSHA1(leftData);
	const rightDataSHA1 = encryptSHA1(rightData);
	return { is_diff: leftDataSHA1 !== rightDataSHA1, left_hash: leftDataSHA1, right_hash: rightDataSHA1 };
};
const encryptSHA1 = (data: any): string | undefined => {
	try {
		if (typeof data === 'string') {
			try {
				return SHA1(data).toString();
			} catch (stringErr: any) {
				console.error(stringErr);
				return undefined;
			}
		}
		try {
			return SHA1(JSON.stringify(data)).toString();
		} catch (jsonErr: any) {
			console.error(jsonErr);
			return undefined;
		}
	} catch (e: any) {
		console.error(e);
		return undefined;
	}
};
