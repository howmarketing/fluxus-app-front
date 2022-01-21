/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Landing from '@components/Landing';
import { H1 } from '@components/HomePage/styles';
import { useNearRPCContext } from '@hooks/index';
// import NearLogo from '@public/near-logo.png';
import ButtonPrimary from '@components/ButtonPrimary';
import { withdrawAllReward } from '@services/m-token';

const wallet: NextPage = function () {
	const nearRPCContext = useNearRPCContext();

	// Define the near RPC Provider from Context API to window global DOM Variables. This make able to cross use yours functions call.
	const defineWindowProperties = async (): Promise<void> => {
		try {
			Object.defineProperty(window, 'nearRPC', { value: nearRPCContext, writable: true });
			console.log('Window property nearRPCContext setted: ', nearRPCContext);
		} catch (e: any) {
			console.error(e);
		}
	};

	const executeOpnerFunction = () => {
		const waitingForOpnerFunction = setInterval(() => {
			try {
				if ('execFunctionProps' in window) {
					const w = window as Window &
						typeof globalThis & {
							execFunctionProps: { functionName: string; function: any; args: Record<any, any> };
						};
					console.log(w.execFunctionProps);
					clearInterval(waitingForOpnerFunction);
					const fArgs = Object.values(w.execFunctionProps.args);
					// nearRPCContext.getWallet().isSignedIn();
					// nearRPCContext.getWallet().requestSignIn();
					// withdrawAllReward(fArgs[0], fArgs[1], fArgs[2]);
					// w.execFunctionProps.function(fArgs[0], fArgs[1], fArgs[2]);
				} else {
					console.log('execFunctionProps not founded yet');
				}
			} catch (e: any) {
				console.error(e);
			}
		}, 2000);
	};

	useEffect(() => {
		const DOMLoaded = true;
		(async () => {
			if (DOMLoaded) {
				await defineWindowProperties();
				executeOpnerFunction();
			}
		})();
	}, []);

	return (
		<>
			<Head>
				<title>Wallet Window</title>
			</Head>
			<Landing
				background={{
					backgroundImage: 'bg-home-min.jpg',
					backgroundColor: '#f9f8fa',
				}}>
				<>
					<div
						style={{
							width: '100vw',
							height: 'auto',
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<div
							style={{
								width: '100vw',
								height: 'auto',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<H1
								style={{ margin: '30px 0 86px 0', fontSize: '1.4rem' }}
								title="Loading Wallet From Near">
								Loading Wallet From Near
							</H1>
						</div>
						<div
							style={{
								width: '155px',
								height: '155px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: '#FFFF',
								boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
								borderRadius: '10px',
							}}>
							<img
								width="135px"
								height="auto"
								src="near-logo.png"
								title="Near wallet logo"
								alt="Near Wallet Logo"
							/>
						</div>
						<div
							style={{
								width: '100vw',
								height: 'auto',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								marginTop: '25px',
							}}>
							<ButtonPrimary>Cancel Wallet Request</ButtonPrimary>
						</div>
					</div>
				</>
			</Landing>
		</>
	);
};

export default wallet;
