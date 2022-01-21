import React, { useRef, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useNearData } from '@hooks/useNearData';
import Landing from '@components/Landing';
import { H1 } from '@components/HomePage/styles';
import CardUserRewards from '@components/CardUserRewards';
import VaultList from '@components/VaultList';
import { homePageMetaDescribes } from '../consts';

const Vaults: NextPage = function () {
	const { nearPriceState } = useNearData();
	useEffect(() => {}, []);

	return (
		<>
			<Head>
				<title>
					{homePageMetaDescribes.title} {nearPriceState?.usd || '...'}
				</title>
			</Head>
			<Landing
				background={{
					backgroundImage: 'bg-home-min.jpg',
					backgroundColor: '#100317',
				}}>
				<>
					<H1 title="Vaults for auto compound farm rewards">Vaults for auto compound farm rewards</H1>
					<VaultList />
				</>
			</Landing>
		</>
	);
};

export default Vaults;
