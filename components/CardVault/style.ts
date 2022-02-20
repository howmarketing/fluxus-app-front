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

export const ghostProps = `
	transition: all 0.2s ease-in-out;
	border-radius: 8px;
	border: solid 1px transparent;
	background-color: #121212;
	background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(101deg, #00f5cc, #7623f5) !important;
	background-origin: border-box;
	box-shadow: 1px 1000px 1px #121212 inset;
	color: #f9f8fa;
	font-family: Mulish;
	font-size: 1.1rem;
	font-weight: 300;
	text-transform: none;
	text-shadow: none;
	outline: none;
	filter: none;

	&:hover {
		filter: brightness(1.2);
		transform: scale(1.03);
		color: #00f5cc;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #f43085, #7623f5, #00f5cc) !important;
	}
	&:target,
	&:focus-within,
	&:active,
	&:focus-visible,
	&:visited {
		filter: brightness(1.1);
		color: #7623f5;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #f43085, #00f5cc) !important;
	}
	&:active {
		filter: brightness(1.1);
		color: #f43085;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #7623f5, #00f5cc, #f43085) !important;
	}
`;

export const CardVaultAreaStyled = styled.div<ICard>`
	transition: all 0.2s linear;
	padding: 32px;
	display: flex;
	justify-content: stretch;
	align-items: stretch;
	flex-direction: row;
	flex-wrap: wrap;
	min-width: 180px;
	height: auto;
	min-height: 66px;
	width: 100%;
	max-width: calc(50% - 24px);
	@media screen and (max-width: 800px) {
		max-width: calc(100% - 32px);
	}
	background-color: ${({ theme }) => (theme.title === 'LIGHT' ? '#fcfcfc' : '#121212')};
	border-radius: 8px;
	margin: 12px 0;
	overflow: hidden;
	box-shadow: 7px 7px 25px ${({ theme }) => (theme.title === 'LIGHT' ? 'rgba(98, 209, 180, 0.3)' : '#00000054')};
	&:hover {
		transition: all 0.2s linear;
		box-shadow: 4px 6px 16px ${({ theme }) => (theme.title === 'LIGHT' ? 'rgba(98, 209, 180, 0.3)' : '#2504b152')};
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
	flex-wrap: nowrap;
	width: 100%;
	padding: 0;
	height: 51px;
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
	flex: 2;

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
	flex: 7;

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
		font-size: 1.35rem;
		font-weight: 600;
		color: ${({ theme }) => (theme.title === 'LIGHT' ? '#100317' : '#f8f8fa')};
		${CardHeader}:hover & {
			transition: all 0.1s linear;
			padding: 0 0 0 10px;
		}
	}
`;

export const CardBodyEarnings = styled.div`
	transition: all 0.1s linear;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	flex-wrap: wrap;
	flex: 2;
	padding: 0 35px 0 32px;
	height: 56px;
	& > label {
		display: inline-block;
		width: auto;
		font-family: 'Mulish', sans-serif;
		font-weight: 400;
		font-size: 1.2rem;
		text-align: left;
		color: ${({ theme }) => (theme.title === 'LIGHT' ? theme.colors.tertiary_dark_purple : '#f8f8fa')};
	}
	& > div[data-type='drop-earnings'] {
		display: inline-block;
		width: 60%;
		font-family: 'Mulish', sans-serif;
		font-weight: 600;
		font-size: 1.16rem;
		text-align: right;
		padding: 0 28px 0 0;
		color: ${({ theme }) => (theme.title === 'LIGHT' ? theme.colors.grey : '#F8F8F9')} !important;
		& > img.coinIcon {
			position: absolute;
			margin-left: 8px;
			margin-top: 0;
		}
	}
	&[data-type='ghost'] {
		${ghostProps}
	}
`;

export const CardBodyRewardsList = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	flex-wrap: nowrap;
	padding: 16px 0 8px 0;
	& > div[data-type='label'] {
		min-width: 119px;
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: row;
		flex-wrap: nowrap;
		margin-right: 55px;
		gap: 8px;
		color: #f8f8f9;
		font-family: 'Mulish', sans-serif;
		font-size: 1rem;
		font-weight: 400;
		width: auto;
		padding: 0 5px 0 0;
		& > img {
			position: absolute;
			right: -18px;
			top: 3.49px;
		}
	}
	& > div[data-type='rewardsList'] {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: row;
		flex-wrap: nowrap;
		overflow-x: clip;
		overflow-y: clip;
		overflow-wrap: unset;
		gap: 8px;
		color: #f8f8f9;
		font-family: 'Mulish', sans-serif;
		font-size: 1rem;
		font-weight: 400;
		width: auto;
		min-width: calc(40% + 25px);
		min-height: 40px;
		padding: 0 0 0 calc(50% - 8em);
		& > span {
			display: flex;
			min-width: 62px;
			flex-direction: row;
			flex-wrap: nowrap;
			overflow-wrap: unset;
			overflow: hidden;
			position: relative;
			margin-right: 11px;
			padding-top: 3px;
			color: #f8f8f9 !important;
			font-family: 'Mulish', sans-serif;
			font-weight: 600;
			font-size: 1.138rem;
		}
		& > img {
			transition: all 0.1s linear;
			cursor: pointer;
			position: relative;
			transform: scale(0.95);
			z-index: 99;
			margin-left: -14px;
			border-radius: 1000px;
			box-shadow: -3px 2px 6px rgba(0, 0, 0, 1);
			transform: scale(1.04);
			&:hover {
				transition: all 0.1s linear;
				transform: scale(1.1508) rotate(-35deg);
				filter: brightness(1.2);
				margin-left: -8px;
				box-shadow: -3px -1px 5px rgba(0, 105, 255, 0.39) !important;
				z-index: 999 !important;
			}
		}
	}
`;

export const CardBodyCompountInfo = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	flex-wrap: nowrap;
	padding: 0;
	& > div[data-type='coumpound-item'] {
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 2px;
		color: #f8f8f9;
		font-family: 'Mulish', sans-serif;
		font-size: 1rem;
		font-weight: 400;
		width: auto;
		padding: 0 5px 0 0;
		& > label {
			width: 100%;
			font-family: 'Mulish', sans-serif;
			font-weight: 400;
			font-size: 0.92rem;
			font-style: italic;
			color: ${({ theme }) => (theme.title === 'LIGHT' ? '#7623F5' : '#7623F5')} !important;
		}
		& > span {
			width: 100%;
			font-family: 'Mulish', sans-serif;
			font-weight: 600;
			font-size: 1.14rem;
			color: ${({ theme }) => (theme.title === 'LIGHT' ? '#121213' : '#f8f8f9')} !important;
		}
	}
`;

export const Separator = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 2.38em;
	height: 1px;
	overflow: hidden;
	opacity: 0.7;
	margin: 22px auto;
	& > span {
		${ghostProps}
		width: 100%;
		height: 0px;
		display: flex;
		border: 1px solid transparent !important;
		border-radius: none !important;
	}
`;

export const CardBodyVaultInfo = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	flex-wrap: nowrap;
	padding: 15px 0 0 0;
	& > div[data-type='vault-item'] {
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 4px;
		color: #f8f8f9;
		font-family: 'Mulish', sans-serif;
		font-size: 1rem;
		font-weight: 400;
		width: auto;
		padding: 0 5px 0 0;
		& > label {
			width: 100%;
			font-family: 'Mulish', sans-serif;
			font-weight: 500;
			font-size: 0.88rem;
			color: ${({ theme }) => (theme.title === 'LIGHT' ? '#f8f8f9' : '#f8f8f9')} !important;
		}
		& > span {
			width: 100%;
			font-family: 'Mulish', sans-serif;
			font-weight: 600;
			font-size: 1.25rem;
			color: ${({ theme }) => (theme.title === 'LIGHT' ? '#121213' : '#FFFFFF')} !important;
		}
	}
`;

export const CardHeaderMultiplier = styled(CardBodyEarnings)`
	flex: 3;
`;

export const CardHeaderTotalDeposited = styled(CardBodyEarnings)`
	justify-content: flex-end;
	align-items: flex-end;
	flex-direction: row;
	flex-wrap: wrap;
	flex: 2;
	padding: 0;
	& > label {
		display: inline-block;
		width: 100%;
		font-family: 'Mulish', sans-serif;
		font-weight: 400;
		font-size: 0.85rem;
		text-align: right;
		color: ${({ theme }) =>
			theme.title === 'LIGHT' ? theme.colors.tertiary_dark_purple : 'rgba(255, 255, 255, .8)'};
	}
	& > span {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-end;
		align-items: center;
		overflow: hidden;
		overflow-wrap: unset;
		width: 100%;
		min-width: 120px;
		font-family: 'Mulish', sans-serif;
		font-weight: 600;
		font-size: 1.25rem;
		text-align: right;
	}
`;

export const CardHeaderAPYX = styled(CardBodyEarnings)`
	flex: 2;
`;

export const CardHeaderDropDown = styled(CardBodyEarnings)`
	justify-content: center;
	flex: 1;
	${CardVaultAreaStyled}[data-status="opened"] & > img {
		transform: rotate(-90deg);
	}
`;

export const CardBody = styled.div<ICardBody>`
	display: flex;
	justify-content: stretch;
	align-items: stretch;
	& > ${CardContainerStyled} {
		padding: 0;
		justify-content: flex-start;
	}
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
	min-height: 300px;
`;

export const CardBodyTabs = styled.div<ICardBodyTabs>`
	display: flex;
	justify-content: stretch;
	align-items: stretch;
	flex-direction: row;
	flex-wrap: nowrap;
	width: 100%;
	min-height: 36px;
	padding: 10px 0 0 0;
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
				color: ${({ theme }) => (theme.title === 'LIGHT' ? '#666675' : '#FFFFFF90')} !important;
				display: block;
				border-bottom: 1.8px solid transparent;
				padding: 5px 4px 3px 4px;
				background-color: rgba(0, 0, 0, 0);
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
				border-bottom-left-radius: 0px;
				border-bottom-right-radius: 0px;
				&:hover {
					text-decoration: none !important;
				}
			}

			&.active > a {
				color: #00f5d3 !important;
				border-bottom: 2px solid #00f5d3;
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
	padding: 32px 0 0 0;
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
