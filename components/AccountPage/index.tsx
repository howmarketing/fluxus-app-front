import React, { useEffect, useState, useRef } from 'react';
import Landing from '@components/Landing';
import { getTokenBalances } from '@services/token';
import { useNearRPCContext } from '@hooks/index';
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
	const nearRPCContext = useNearRPCContext();
	const [balancesState, setBalancesState] = useState<any>({} as any);
	useEffect(() => {
		(async () => {
			if (nearRPCContext.getWallet().isSignedIn()) {
				const balances = await getTokenBalances();
				console.log(balances);
				setBalancesState(balances);
			}
		})();
	}, []);
	return <div className="card">{JSON.stringify(balancesState)}</div>;
};
export default AccountPage;
