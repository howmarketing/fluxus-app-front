import React from 'react';
import Landing from '@components/Landing';
import FarmList from '@components/FarmList/index';
import CardUserRewards from '@components/CardUserRewards';
import { H1 } from './styles';

const HomePage: React.FC = function () {
	return (
		<Landing
			background={{
				backgroundImage: 'bg-home-min.jpg',
				backgroundColor: '#100317',
			}}>
			<>
				<H1 title="Near's DeFi Yield Aggregator">{`${`Near`}'s DeFi Yield Aggregator`}</H1>
				<CardUserRewards />
				<FarmList />
			</>
		</Landing>
	);
};

export default HomePage;
