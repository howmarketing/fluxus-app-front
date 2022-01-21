import React from 'react';
import styled from 'styled-components';
import { CardStyled, CardContainerStyled } from '@components/Card/style';

export const CardRewardsStyled = styled(CardStyled)`
	background-color: ${({ theme }) => (theme.title === 'LIGHT' ? '#FFFFFF' : '#121212')};
`;

export const CardRewardsContainerStyled = styled(CardContainerStyled)`
	justify-content: flex-start;
	align-items: flex-start;
	padding: 15px;
`;
export const RewardsTitle = styled.h1`
	color: ${({ theme }) => (theme.title === 'LIGHT' ? '#212121' : '#63cdb5')} !important;
	font-size: 16px;
	width: 100%;
	text-align: left;
	margin-bottom: 20px;
`;
export const CardRewardsContentStyled = styled.div`
	padding: 0px 0;
	flex-wrap: wrap;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: row;
	gap: 8px;
	width: 100%;
	height: auto;
	min-height: 62px;
`;
export const CardRewardsAmountContentStyled = styled.div`
	min-width: 176px;
	width: 40%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 5px;
	@media screen and (max-width: 800px) {
		width: 100%;
	}
	& > input {
		width: 100% !important;
		max-width: 100% !important;
		background-color: #232324 !important;
	}
	& > span,
	& > a {
		font-size: 9px;
	}
`;
const ISymbol = CardRewardsAmountContentStyled;
export const CardRewardsAmountSymbolStyled = styled(ISymbol)`
	min-width: 170px;
	width: auto;
	justify-content: flex-start;
	padding: 0 0 0 15px;
	align-items: center;
	@media screen and (max-width: 800px) {
		justify-content: center;
		padding: 12px 0 0 0;
	}
	& > h2 {
		font-size: 16px;
		font-weight: 600;
		color: #7797a7;
	}
`;
export const CardRewardsFooterStyled = styled.div`
	display: flex;
	justify-content: stretch;
	align-items: center;
	flex-direction: row;
	gap: 15px;
	width: 100%;
`;
