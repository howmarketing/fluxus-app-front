/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Link from 'next/link';
import { ICard, CardStyled, CardContainerStyled } from './style';

export const Card: React.FC<ICard> = function ({ ...props }) {
	return (
		<CardStyled {...props}>
			<CardContainerStyled>{(props?.children && props.children) || <span>-</span>}</CardContainerStyled>
		</CardStyled>
	);
};
export default Card;
