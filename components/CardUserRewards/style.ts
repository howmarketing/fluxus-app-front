import React from 'react';
import styled from 'styled-components';
import { CardStyled, CardContainerStyled } from '@components/Card/style';
import CardRewards from '@components/CardRewards';

export const CardURewardsStyle = styled(CardRewards)`
	flex-wrap: wrap;
	background-color: ${({ theme }) => (theme.title === 'LIGHT' ? '#FFFFFF' : '#121212')};
	min-height: 145px;
	box-shadow: -9px 7px 69px rgba(3, 74, 62, 0.52) !important;
	& input {
		color: #ffffff;
	}
`;

export const SwitchArea = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 15px;
	gap: 8px;
	& > div {
		padding: 0 !important;
	}
`;

export const WrapCenterView = styled.div`
	width: 425px;
	max-width: calc(50vw + 50px);
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 16px 0;
	gap: 8px;
	& > ${SwitchArea} {
		padding: 0 !important;
	}
`;
export const SwitchAreaTitle = styled.h1`
	display: inline-block;
	text-align: left;
	margin: 0;
	color: ${({ theme }) => theme.colors.text} !important;
	font-weight: 600;
	font-size: 0.8rem;
	& > span {
		font-weight: 500;
		font-family: 'Mulish', sans-serif;
		font-size: 0.85rem;
		&.selected {
			color: ${({ theme }) => theme.colors.primary_green};
		}
	}
`;
export const SwitchAreaTitleTag = styled.span`
	position: absolute;
	background-color: ${({ theme }) => theme.colors.background_primary}70 !important;
	border: 1px solid ${({ theme }) => theme.colors.primary_green};
	color: ${({ theme }) => theme.colors.primary_green};
	font-family: 'Mulish', sans-serif;
	font-size: 0.7rem;
	font-style: italic;
	font-weight: 600;
	border-radius: 6px;
	padding: 1px 7px;
	z-index: 999;
	margin-top: 1px;
	margin-left: 42px;
	transform: scale(0.88);
`;
