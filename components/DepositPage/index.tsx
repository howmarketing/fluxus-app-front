import React, { useEffect, useState } from 'react';
import Landing from '@components/Landing';
import { useNearRPCContext } from '@hooks/index';
import {
	getTokenBalances,
	getUserRegisteredTokens,
	getWhitelistedTokens,
	registerTokenAndExchange,
} from '@services/token';
import { ftGetTokenMetadata, ftRegisterExchange } from '@services/ft-contract';
import { getRewardByTokenId } from '@services/farm';
import { H1, Card, CardRow, CardHeaderWrapper, BalancesTokenWrapper } from './styles';

const DepositPage: React.FC = function () {
	return (
		<Landing
			background={{
				backgroundImage: 'bg-home-min.jpg',
				backgroundColor: '#100317',
			}}>
			<>
				<H1 title="Balances Token">Balances Token</H1>
				<Card>
					<CardRow>
						<CardHeader />
						<BalancesToken />
					</CardRow>
				</Card>
			</>
		</Landing>
	);
};

// Card Wrapper Header
const CardHeader: React.FC = function () {
	const a = '';
	return (
		<>
			<CardHeaderWrapper>
				<h1 title="Header">Header</h1>
			</CardHeaderWrapper>
		</>
	);
};

// Get Balances Token
const BalancesToken: React.FC = function () {
	const nearRPCContext = useNearRPCContext();
	const [balancesState, setBalancesState] = useState<any>({} as any);
	useEffect(() => {
		(async () => {
			if (nearRPCContext.getWallet().isSignedIn()) {
				const useFluxusFarmContract = true;
				const leoTokens = [
					'fluxustest.leopollum.testnet',
					'fluxustest3.leopollum.testnet',
					'uxu.leopollum.testnet',
					'uxuu.leopollum.testnet',
					'fluxustest4.leopollum.testnet',
				];
				// tudo aqui é teste e deve ser removido
				const tokenID = leoTokens[3];
				const tokenMetaData = await ftGetTokenMetadata(tokenID, true);
				const rewardForToken = await getRewardByTokenId(tokenID, undefined, useFluxusFarmContract);
				const tokenData = {
					...tokenMetaData,
					total_user_reward_value: rewardForToken,
				};

				console.log('Register token: ', tokenID);
				console.log('tokenData: ', tokenData);
				await new Promise<boolean>((resolve, reject) => {
					setTimeout(() => {
						resolve(true);
					}, 20000);
				});
				// Invoke method storage_deposit from token contract to user logged account do a min amount deposit to token account (Token get back this near amount after registration ibecouse of registration_only arguments as true).
				// await ftRegisterExchange(tokenID);
				// registerTokenAndExchange(tokenID);
				// console.log(register);
				const tokenBalances = await getTokenBalances(undefined, false);
				const userRegisteredTokens = await getUserRegisteredTokens(undefined, undefined, true);
				const whiteListTokens = await getWhitelistedTokens(undefined, false);
				console.log({
					tokenBalances,
					userRegisteredTokens,
					whiteListTokens,
				});
			}
		})();
	}, []);
	return (
		<>
			<BalancesTokenWrapper id="BalancesTokenCardContent">{JSON.stringify(balancesState)}</BalancesTokenWrapper>
		</>
	);
};
export default DepositPage;
