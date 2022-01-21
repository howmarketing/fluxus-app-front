import React, { useRef, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useNearData } from '@hooks/useNearData';
import HomePage from '@components/HomePage';
import ButtonGhost from '@components/ButtonGhost';
import DepositPage from '@components/DepositPage';
import { homePageMetaDescribes } from '../consts';

const Deposit: NextPage = function () {
	const { nearPriceState } = useNearData();
	useEffect(() => {}, []);

	return (
		<>
			<Head>
				<title>
					{homePageMetaDescribes.title} {nearPriceState?.usd || '...'}
				</title>
			</Head>
			<DepositPage />
		</>
	);
};

export default Deposit;
