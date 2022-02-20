import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type Response<T> = [T, Dispatch<SetStateAction<T>>];

type setPersistedStateResponse = {
	keyAlreadyStorade: boolean;
	stateKey: string;
	stateValue: any;
	DOMLoaded: boolean;
};
function usePersistedState<T>(key: string, initialState: T): Response<T> {
	const setPersistedState = (): setPersistedStateResponse => {
		if (typeof window !== 'undefined') {
			const storageValue = localStorage.getItem(key);
			if (storageValue) {
				return {
					keyAlreadyStorade: true,
					stateKey: key,
					stateValue: JSON.parse(storageValue),
					DOMLoaded: true,
				};
			}
			return {
				keyAlreadyStorade: false,
				stateKey: key,
				stateValue: initialState,
				DOMLoaded: true,
			};
		}
		return {
			keyAlreadyStorade: false,
			stateKey: key,
			stateValue: initialState,
			DOMLoaded: false,
		};
	};
	const settedPersistedState = setPersistedState();
	const [state, setState] = useState<T>(settedPersistedState.stateValue);

	useEffect(() => {
		if (settedPersistedState.DOMLoaded && !settedPersistedState.keyAlreadyStorade) {
			try {
				const stateAsJson = JSON.stringify(state);
				localStorage.setItem(key, stateAsJson);
			} catch (e: any) {
				localStorage.setItem(
					`${key}-setKeyError`,
					`Catch error when try to stringify values to set on key: ${key}. Error message: ${
						e?.message || '[unknow error message]'
					}`,
				);
			}
		}
	}, [state]);

	return [state, setState];
}

export default usePersistedState;
