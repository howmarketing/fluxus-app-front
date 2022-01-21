/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import type { NextPage } from 'next';
import { INearPriceResponse, getNearPrice } from '@utils/getNearPrice';
import { NearRPCProvider } from '@contexts/index';

export type iNearPriceState = INearPriceResponse & {};

export type iNearDataContextProvided = {
	nearPriceState: iNearPriceState | null;
	setNearPriceState: (NearStatePrice: iNearPriceState | null) => void;
};

export const NearDataContext = createContext({} as iNearDataContextProvided);

export type NearContextProviderProps = {
	children?: ReactNode;
};
// export const NearDataProvider = function (props: NearContextProviderProps) {
export const NearDataProvider: NextPage = function ({ children }) {
	const [nearPriceState, setNearPriceState] = useState<iNearPriceState | null>(null);

	const setNearPrice = async () => {
		const nearPrice = await getNearPrice();
		if (nearPrice) {
			setNearPriceState(nearPrice);
		}
	};

	useEffect(() => {
		setNearPrice();
	}, []);
	useEffect(() => {
		const t = setTimeout(async () => {
			setNearPrice();
		}, (process?.env?.UPDATE_FIT_TIMEOUT && parseInt(process.env.UPDATE_FIT_TIMEOUT, 10)) || 60 * 60 * 1000);
		return () => {
			clearTimeout(t);
		};
	}, [nearPriceState]);
	return (
		<NearDataContext.Provider value={{ nearPriceState, setNearPriceState }}>
			<NearRPCProvider>{children}</NearRPCProvider>
		</NearDataContext.Provider>
	);
};
