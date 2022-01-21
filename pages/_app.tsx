/* eslint-disable @next/next/google-font-display */
/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, ReactNode } from 'react';
import { AppProps } from 'next/app';
import { GlobalStyle } from 'styles/global';
import { DarkModeProvider } from 'contexts/darkMode';
import Head from 'next/head';
import { homePageMetaDescribes } from '../consts';

const MyApp: React.FC<AppProps> = function ({ Component, pageProps }) {
	const [stateInit, setStateInit] = useState<boolean>(false);
	const SafeHydrate = ({ children }: React.PropsWithChildren<ReactNode>) => {
		let windowCheck: (Window & typeof globalThis) | boolean = false;
		if (!stateInit) {
			return <>{` `}</>;
		}
		try {
			windowCheck = typeof window === 'undefined' ? false : window;
			return <>{windowCheck !== false && children}</>;
		} catch (e: any) {
			console.log(`SafeHydrate: ${e?.message || `Unknown`}`);
			return <>{` `}</>;
		}
	};
	useEffect(() => {
		const loadDoomTimeout = setTimeout(() => {
			setStateInit(true);
		}, 200);
		return () => {
			clearTimeout(loadDoomTimeout);
		};
	}, []);
	return (
		<SafeHydrate>
			<DarkModeProvider>
				<Head>
					<title>{homePageMetaDescribes.title}</title>
					<meta
						name="viewport"
						content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
					/>
					<meta name="description" content={homePageMetaDescribes.description} />
					<meta property="og:url" content="" key="ogurl" />
					<meta property="og:image" content={homePageMetaDescribes.sharedOgImage} key="ogimage" />
					<meta property="og:site_name" content={homePageMetaDescribes.title} key="ogsitename" />
					<meta property="og:title" content={homePageMetaDescribes.title} key="ogtitle" />
					<meta property="og:description" content={homePageMetaDescribes.description} key="ogdesc" />
					<link rel="icon" href="/favicon.ico" />
					<meta property="twitter:card" content="summary_large_image" />
					<meta property="twitter:url" content="" />
					<meta property="twitter:title" content={homePageMetaDescribes.title} />
					<meta property="twitter:description" content={homePageMetaDescribes.description} />
					<meta property="twitter:image" content={homePageMetaDescribes.sharedOgImage} />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
					<link
						href="https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css?family=Prompt:100,100italic,200,200italic,300,300italic,regular,italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css?family=Mulish:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic"
						rel="stylesheet"
					/>
				</Head>
				<GlobalStyle />
				<Component {...pageProps} />
			</DarkModeProvider>
		</SafeHydrate>
	);
};
export default MyApp;
