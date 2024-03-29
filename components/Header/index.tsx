/* eslint-disable no-alert */
/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ButtonGhost from '@components/ButtonGhost';
import SwitchThemeButton from '@components/SwitchThemeButton';
import LogoImage from '@components/LogoImage';
// import { useWallet } from '@hooks/useWallet';
// import Code from '@components/debug/code';

import { useNearRPCContext } from '@hooks/index';
import { nearWalletAsWindow } from '@utils/nearWalletAsWindow';
import { REF_FARM_CONTRACT_ID } from '@ProviderPattern/services/near';
import { INearRPCContext } from '@contexts/nearData/nearRPCData';
import ProviderPattern from '@ProviderPattern/index';
import { resolve } from 'path';
import AbstractMainMTokenProviderAction from '@ProviderPattern/models/Actions/AbstractMainMTokenProviderAction';
import {
	HeaderStyled,
	HeaderContainer,
	HeaderLogoArea,
	HeaderMenuLinkslist,
	HeaderActionsArea,
	IHeader,
} from './style';

export const Header: React.FC<IHeader> = ({ ...props }) => {
	const nearRPCContext = useNearRPCContext();
	const [currentUrlPath, setCurrentUrlPath] = useState('/loading');

	const setMenuHeaderActivedLink = () => {
		try {
			if (!(typeof window !== 'undefined')) {
				return;
			}
			const urlPathName = window.location.pathname;
			setCurrentUrlPath(urlPathName || '/');
		} catch (e: any) {
			console.error(e);
		}
	};

	const requestWalletConnection = async () => {
		try {
			nearWalletAsWindow._makeItWaitBeforeClose = 3000;
			const windowWalletProvider = await nearWalletAsWindow.getWindowWalletRPC<ProviderPattern>(true);
			console.log('windowWalletProvider: ', windowWalletProvider);
			await new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(true);
				}, 2500);
			});
			await windowWalletProvider.getProvider().getWallet().requestSignIn({
				contractId: windowWalletProvider.getProvider().getProviderConfigData().FLUXUS_VAULT_CONTRACT_ID,
			});
			const walletResponse = await nearWalletAsWindow.getWalletCallback();
			if (!walletResponse.success) {
				alert(walletResponse.message);
				return;
			}
			try {
				window.document.querySelectorAll('body')[0].style.opacity = '0.3';
				setTimeout(() => {
					window.location.href = `${window.location.href}?loggedin=true`;
				}, 2500);
			} catch (e: any) {
				// Error log
				console.log(`Refresh window error.`);
			}
		} catch (e: any) {
			window.alert(`${e?.message || 'Unknown wallet sign request error.'}`);
		}
	};

	const requestWalletSignOutConnection = async () => {
		try {
			const windowWalletProvider = await nearWalletAsWindow.getWindowWalletRPC<ProviderPattern>(true);
			windowWalletProvider.getProvider().getWallet().signOut();
			try {
				setTimeout(() => {
					nearWalletAsWindow._getOpnerWindow().location.href =
						nearWalletAsWindow._getOpnerWindow().location.href;
				}, 500);
			} catch (e: any) {
				// Error log
				console.log(
					`Refresh window error. Please, refresh your window manually for apply the wallet sign out request..`,
					e,
				);
			}
		} catch (e: any) {
			window.alert(`${e?.message || 'Unknown wallet sign out request error.'}`);
		}
	};

	useEffect(() => {
		const DOOMLoaded = true;
		(async () => {
			if (!DOOMLoaded) {
				return;
			}
			setMenuHeaderActivedLink();
		})();
	}, []);
	return (
		<HeaderStyled>
			<HeaderContainer>
				<HeaderLogoArea>
					<LogoImage />
				</HeaderLogoArea>
				<HeaderMenuLinkslist>
					<ul>
						<li className={currentUrlPath === '/' ? 'actived' : ''}>
							<Link href="/" scroll>
								Farm
							</Link>
						</li>
						<li className={currentUrlPath.indexOf('/vaults') >= 0 ? 'actived' : ''}>
							<Link href="/vaults" scroll>
								Vaults
							</Link>
						</li>
						<li
							className={currentUrlPath.indexOf('/deposit') >= 0 ? 'actived' : ''}
							style={{ display: 'none' }}>
							<Link href="/deposit" scroll>
								Deposit
							</Link>
						</li>
						<li className="actived" style={{ display: 'none' }}>
							<Link href="/farm" scroll>
								Yield
							</Link>
						</li>
						<li style={{ display: 'none' }}>
							<Link href="/about" scroll>
								About
							</Link>
						</li>
						<li style={{ display: 'none' }}>
							<Link href="/blog" scroll>
								Blog
							</Link>
						</li>
						<li style={{ display: 'none' }}>
							<Link href="/blog" scroll>
								Docs
							</Link>
						</li>
					</ul>
				</HeaderMenuLinkslist>
				<HeaderActionsArea>
					<ButtonGhost
						onClick={() => {
							if (!ProviderPattern.getProviderInstance().getWallet().isSignedIn()) {
								requestWalletConnection();
							} else {
								requestWalletSignOutConnection();
							}
						}}
						style={{ fontSize: '16px', padding: '0 26px' }}>
						{(ProviderPattern.getProviderInstance().getWallet().isSignedIn() &&
							ProviderPattern.getProviderInstance().getWallet().getAccountId()) ||
							`Connect Wallet`}
					</ButtonGhost>
					<SwitchThemeButton />
				</HeaderActionsArea>
			</HeaderContainer>
		</HeaderStyled>
	);
};
