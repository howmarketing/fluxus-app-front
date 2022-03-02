import React, { useEffect, useState, useRef } from 'react';
import ProviderPattern from '@ProviderPattern/index';
import Landing from '@components/Landing';
import { H1 } from './styles';

const AccountPage: React.FC = function () {
	return (
		<Landing
			background={{
				backgroundImage: 'bg-home-min.jpg',
				backgroundColor: '#100317',
			}}>
			<>
				<H1 title="Balances Token">Balances Token</H1>
				<BalancesToken />
			</>
		</Landing>
	);
};

const BalancesToken: React.FC = function () {
	const [balancesState, setBalancesState] = useState<any>({} as any);
	useEffect(() => {
		(async () => {
			if (ProviderPattern.getProviderInstance().getWallet().isSignedIn()) {
				const balances = await ProviderPattern.getInstance()
					.getProvider()
					.getProviderActions()
					.getTokenActions()
					.getTokenBalances({});
				// In progress, so, need to keep this with debugging mark
				console.log(balances);
				setBalancesState(balances);
			}
		})();
	}, []);
	return <div className="card">{JSON.stringify(balancesState)}</div>;
};
export default AccountPage;
