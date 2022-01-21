import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Card as CardBase } from '@components/Card/Card';

type IWrapBox = HTMLAttributes<HTMLDivElement>;
type IH1 = HTMLAttributes<HTMLHeadingElement>;

export const Card = styled(CardBase)`
	width: 100%;
	border-radius: 8px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	min-height: 400px;
	background-color: #ffffff;
	color: #212121;
	display: flex;
	justify-content: center;
	align-items: stretch;
	flex-direction: row;
	padding: 0;
`;

export const CardRow = styled(CardBase)`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: column;
	flex-wrap: wrap;
	padding: 0;
`;

export const CardHeaderWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: row;
	padding: 5px 15px;
	margin: 0;
	border-radius: 8px;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
	background-color: #b3b3b3;
	border-bottom: 1px solid #999999;
	& > h1 {
		font-family: 'Syncopate', sans-serif;
		font-size: 0.96rem;
		color: #191919;
	}
`;

export const BalancesTokenWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: row;
	padding: 15px 15px;
`;
export const H1 = styled.h1<IH1>`
	display: inline-block;
	text-align: center;
	margin: 45px 0 75px 0;
	color: ${({ theme }) => theme.colors.primary_green} !important;
	font-weight: 500;
	font-size: 2.2rem;
	text-align: center;
`;

export const WrapBox = styled.div`
	display: flex;
	justify-content: stretch;
	align-items: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
	overflow: clip;
	height: auto;
	min-height: 400px; // Retirar após teste. Se estiver vendo este comentário, por favor deletar a linha.
	width: 100%;
	max-width: 1244px;
	background-color: transparent;
	border-radius: 8px;
`;
