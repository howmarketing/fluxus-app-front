import React from 'react';
import styled from 'styled-components';
import { CardStyled, CardContainerStyled } from '@components/Card/style';

export const CardRewardsStyled = styled(CardStyled)`
	display: flex;
	flex-direction: column;
	background-color: ${({ theme }) => (theme.title === 'LIGHT' ? '#FFFFFF' : '#121212')};
	min-height: 145px;
`;

export const CardRewardsContainerStyled = styled(CardContainerStyled)`
	justify-content: flex-start;
	align-items: flex-start;
	${CardRewardsStyled} & {
		justify-content: flex-start;
		align-items: flex-start;
		gap: 10px;
	}
`;
export const CardRewardsTitleContainerStyled = styled(CardContainerStyled)`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	${CardRewardsStyled} & {
		justify-content: flex-start;
		align-items: flex-start;
		& > h1 {
			color: ${({ theme }) => (theme.title === 'LIGHT' ? '#212121' : '#63cdb5')} !important;
			font-size: 20px;
			width: 100%;
			text-align: left;
			margin: 0 0 32px 0;
		}
	}
`;
export const CardRewardsContentContainerStyled = styled(CardContainerStyled)`
	justify-content: flex-start;
	align-items: flex-start;
	margin-bottom: 32px;
	overflow-y: overlay;
	${CardRewardsStyled} & {
		justify-content: flex-start;
		align-items: flex-start;
		gap: 10px;
	}
	&::-webkit-scrollbar {
		width: 6px;
		background-color: transparent;
	}

	&::-webkit-scrollbar-thumb:vertical {
		background-color: ${({ theme }) => theme.colors.dark_grey}30;
		border-radius: 1000px;
	}
`;
export const CardRewardsContentStyled = styled.div`
	padding: 0px 0;
	flex-wrap: wrap;
	display: flex;
	justify-content: flex-start;
	align-items: stretch;
	flex-direction: row;
	gap: 8px;
	width: 100%;
	height: auto;
	min-height: 40px;
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
	& input[type='text'],
	& input[type='number'],
	& input[type='email'] {
		width: 100%;
		max-width: 100%;
		min-width: 100%;
		background-color: #232324 !important;
	}
	& input[type='checkbox'] {
		min-width: auto !important;
		width: 21px !important;
		height: 32px !important;
		background-color: #100317;
		background-image: ${({ theme }) =>
			theme.title === `LIGHT`
				? `none`
				: `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(101deg, #00f5cc, #7623f5) !important`};
		background-origin: border-box;
		box-shadow: 2px 1000px 1px ${({ theme }) => (theme.title === `LIGHT` ? `#FFFFFF` : `#12121394`)} inset;
		opacity: 0.4;
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
