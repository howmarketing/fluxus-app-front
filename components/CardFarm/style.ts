import React, { HTMLAttributes, ImgHTMLAttributes } from 'react';
import styled from 'styled-components';

export type IDiv = HTMLAttributes<HTMLDivElement>;
export type ICard = IDiv;
export type ICardContainer = IDiv;
export type ICardHeader = IDiv;
export type ICardBody = IDiv;
export type ICardBodyTabs = IDiv;
export type ICardBodyTabsContent = IDiv;
export type ICardBodyTabsContentItem = IDiv;

export const CardFarmAreaStyled = styled.div<ICard>`
	transition: all 0.2s linear;
	display: flex;
	justify-content: stretch;
	align-items: stretch;
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
	min-width: 780px;
	padding: 0;
	height: auto;
	min-height: 66px;
	background-color: ${({ theme }) => (theme.title === 'LIGHT' ? '#fcfcfc' : '#121212')};
	border-radius: 6px;
	margin: 10px 0;
	overflow: hidden;
	box-shadow: 4px 6px 16px ${({ theme }) => (theme.title === 'LIGHT' ? 'rgba(98, 209, 180, 0.2)' : '#50319936')};
	&[data-status='opened'],
	&:hover {
		transition: all 0.2s linear;
		box-shadow: 4px 6px 16px ${({ theme }) => (theme.title === 'LIGHT' ? 'rgba(98, 209, 180, 0.3)' : '#5031994d')};
		transform: scale(1.0078);
	}
	& a {
		text-decoration: none;
	}
`;

export const CardContainerStyled = styled.div<ICardContainer>`
	transition: all 0.2s linear;
	width: 100%;
	padding: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background-color: transparent;
	& h1,
	& h2,
	& h3,
	& h4,
	& h5,
	& h6,
	& span,
	& p,
	& a {
		font-family: 'Mulish', sans-serif;
		font-weight: 600;
		color: #c3c2cf;
	}
	& p {
		color: #666677;
	}
	& span,
	& a {
		color: #00f5cc !important;
	}
	& a {
		font-style: italic;
		&:hover {
			text-decoration: underline;
		}
	}
	& input {
		transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
		width: 55%;
		min-width: 172px;
		max-width: 100%;
		background-color: #eeeeee;
		height: 37px;
		border-radius: 5px;
		padding: 0 5px 0 10px;
		color: #d7d7df !important;
		border: none;
		font-weight: 600;
		box-shadow: 0px 0px 0px rgba(102, 102, 119, 0);
		@media screen and (max-width: 800px) {
			width: 100%;
			min-width: auto;
		}
		&::placeholder {
			color: #d7d7df;
		}
		&:focus-visible {
			transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
			outline: none;
			box-shadow: 2px 2px 12px rgba(82, 21, 200, 0.15);
			transform: scale(1.03);
		}
	}
`;

export const CardHeader = styled.div<ICardHeader>`
	transition: all 0.2s linear;
	display: flex;
	justify-content: stretch;
	align-items: stretch;
	flex-direction: row;
	width: 100%;
	padding: 10px;
	min-height: 80px;
	border-radius: 10px;
	box-shadow: ${({ theme }) =>
		theme.title === 'LIGHT' ? '0px 0px 10px rgba(0, 0, 0, 0.2)' : '0px 0px 10px rgba(0, 0, 0, 0.78)'};
	& > div {
		display: flex;
		justify-content: stretch;
		align-items: stretch;
		flex-direction: row;
	}
`;

export const CardHeaderCoinPairsIcon = styled.div`
	transition: all 0.1s linear;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	flex: 1;

	& img {
		transition: all 0.1s linear;
		cursor: pointer;
		&:hover {
			filter: brightness(1.1);
			z-index: 3;
			transition: all 0.1s linear;
			box-shadow: -1.5px 1.5px 25px rgba(0, 0, 0, 0.1);
		}
		&:nth-child(1) {
			transform: scale(0.96);
			z-index: 1;
			border-radius: 100%;
			box-shadow: -2px 1px 2px rgba(0, 0, 0, 0.3);
		}
		&:nth-child(2) {
			transform: scale(1.04);
			z-index: 2;
			border-radius: 100%;
			margin-left: -12px;
			box-shadow: -1px 1px 20px rgba(0, 0, 0, 0.2);
		}
	}

	${CardHeader}:hover & {
		transition: all 0.1s linear;
		img {
			transition: all 0.1s linear;
			&:nth-child(1) {
				z-index: 1;
				transform: scale(1.0168);
				margin-left: 15px;
				box-shadow: -1px 1px 20px rgba(0, 0, 0, 0.2);
				&:hover {
					z-index: 3;
					transform: scale(1.0508) rotate(-35deg);
				}
			}
			&:nth-child(2) {
				z-index: 1;
				transform: scale(1.02);
				margin-left: -4px;
				box-shadow: -1px 1px 20px rgba(0, 0, 0, 0.2);
				&:hover {
					z-index: 3;
					transform: scale(1.0508) rotate(-35deg);
				}
			}
		}
	}
`;

export const CardHeaderCoinPairsLabel = styled.div`
	transition: all 0.1s linear;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	flex: 4;

	& h1,
	& h2,
	& h3,
	& h4,
	& h5 {
		transition: all 0.1s linear;
		display: inline-block;
		width: 100%;
		margin: 0;
		padding: 0;
		font-family: 'Mulish', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: ${({ theme }) => (theme.title === 'LIGHT' ? '#100317' : '#f8f8fa')};
		${CardHeader}:hover & {
			transition: all 0.1s linear;
			padding: 0 0 0 10px;
		}
	}
`;

export const CardHeaderEarned = styled.div`
	transition: all 0.1s linear;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	flex-direction: row;
	flex-wrap: wrap;
	flex: 2;
	& > label {
		display: inline-block;
		width: 100%;
		font-family: 'Mulish', sans-serif;
		font-weight: 400;
		font-size: 12px;
		text-align: right;
		color: ${({ theme }) => (theme.title === 'LIGHT' ? theme.colors.tertiary_dark_purple : '#f8f8fa')};
	}
	& > span {
		display: inline-block;
		width: 100%;
		font-family: 'Mulish', sans-serif;
		font-weight: 600;
		font-size: 14px;
		text-align: right;
		color: ${({ theme }) => (theme.title === 'LIGHT' ? theme.colors.grey : '#FFFFFF')} !important;
	}
`;

export const CardHeaderMultiplier = styled(CardHeaderEarned)`
	flex: 3;
`;

export const CardHeaderTotalValueLocked = styled(CardHeaderEarned)`
	flex: 2;
`;

export const CardHeaderAPYX = styled(CardHeaderEarned)`
	flex: 2;
`;

export const CardHeaderDropDown = styled(CardHeaderEarned)`
	justify-content: center;
	flex: 1;
	${CardFarmAreaStyled}[data-status="opened"] & > img {
		transform: rotate(-90deg);
	}
`;

export const CardBody = styled.div<ICardBody>`
	display: none;
	${CardFarmAreaStyled}[data-status="opened"] & {
		display: flex;
	}
	& > ${CardContainerStyled} {
		padding: 10px 25px 15px 25px;
		justify-content: flex-start;
	}
	justify-content: stretch;
	align-items: stretch;
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
	min-height: 385px;
`;

export const CardBodyTabs = styled.div<ICardBodyTabs>`
	display: flex;
	justify-content: stretch;
	align-items: stretch;
	flex-direction: row;
	flex-wrap: nowrap;
	width: 100%;
	min-height: 40px;
	& > ul {
		display: flex;
		justify-content: stretch;
		align-items: stretch;
		width: 100%;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 8px;
		& > li {
			display: flex;
			justify-content: center;
			align-items: center;

			& > a {
				transition: all 0.2s linear;
				color: ${({ theme }) => (theme.title === 'LIGHT' ? '#666675' : '#d5d5d7')} !important;
				display: block;
				border-bottom: 2px solid transparent;
				padding: 5px 9px;
				background-color: rgba(0, 0, 0, 0);
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
				border-bottom-left-radius: 0px;
				border-bottom-right-radius: 0px;
				&:hover {
					background-color: ${({ theme }) =>
						theme.title === 'LIGHT' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.25)'};
					text-decoration: none !important;
				}
			}

			&.active > a {
				color: #63cdb4 !important;
				border-bottom: 2px solid #63cdb4;
				background-color: ${({ theme }) =>
					theme.title === 'LIGHT' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.25)'};
			}
		}
	}
`;

export const CardBodyTabsContent = styled.div<ICardBodyTabsContent>`
	display: flex;
	justify-content: stretch;
	align-items: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
`;

export const CardBodyTabsContentItem = styled.div<ICardBodyTabsContentItem>`
	display: none;
	&.active {
		display: flex;
	}
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
	padding: 40px 5px 15px 5px;
	color: ${({ theme }) => (theme.title === 'LIGHT' ? '#3e3d54' : '#FFFFFF')} !important;
	& > h1,
	& > h2,
	& > h3,
	& > h4,
	& > h5,
	& > p,
	& > span {
		font-family: 'Mulish', sans-serif;
		line-height: 2.1rem;
		font-size: 1.1rem;
		color: ${({ theme }) => (theme.title === 'LIGHT' ? '#3e3d54' : '#FFFFFF')} !important;
	}

	& > h1,
	& > h2,
	& > h3,
	& > h4,
	& > h5 {
		font-size: 1.8rem;
		font-weight: 300;
		text-shadow: ${({ theme }) =>
			theme.title === 'LIGHT' ? '0px 0px 0px rgba(0, 0, 0, 0.0)' : '2px 2px 5px rgba(0, 0, 0, 0.86)'};
		margin: 10px -9px 15px -8px;
		color: ${({ theme }) => (theme.title === 'LIGHT' ? theme.colors.tertiary_dark_purple : '#63cdb4')} !important;
	}
	& > h2 {
		font-size: 1.6rem;
	}
	& > h3 {
		font-size: 1.42rem;
	}
	& > h4 {
		font-size: 1.26rem;
	}
	& > h5 {
		font-size: 1.12rem;
	}

	& > ul {
		margin-top: 15px;
		padding: 15px 0 15px 0;
		list-style-type: none !important;
		display: flex;
		gap: 15px;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		width: 100%;
		& > li {
			font-style: normal !important;
			& > a {
				font-size: 1.1rem;
				font-style: normal !important;
				text-decoration: none !important;
			}
			& > ul {
				list-style-type: none !important;
				padding: 8px 0 5px 0;
				display: flex;
				gap: 10px;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				width: 100%;
				flex-wrap: wrap;
				flex-basis: 100%;
				& > li {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-direction: row;
					& > img {
						margin-right: 5px;
					}
				}
			}
		}
	}
`;
