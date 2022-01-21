/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import React, { ReactChild, ReactElement } from 'react';
import { Header } from 'components/Header';
import { Footer } from '@components/Footer';
import { WrappContent, Main, Row } from './styles';

type ILanding = {
	children?: ReactChild | undefined;
	background?: {
		backgroundImage?: string | undefined;
		backgroundColor?: string | undefined;
	};
};

const Landing = function (props: ILanding) {
	return (
		<WrappContent
			data-id="wrappLandingContent"
			style={{
				backgroundImage: props?.background?.backgroundImage && `url(${props.background.backgroundImage})`,
				backgroundColor: props?.background?.backgroundColor,
			}}>
			<Header />
			<Main data-id="mainLandingContent">
				<Row data-id="rowLandingMainContent">{props?.children && props.children}</Row>
			</Main>
			<Footer />
		</WrappContent>
	);
};

export default Landing;
