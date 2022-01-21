import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

export type IHeader = HTMLAttributes<HTMLHtmlElement>;

export const HeaderStyled = styled.header<IHeader>`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: auto;
	padding: 22.5px 0;
	/* background-color: ${({ theme }) => theme.colors.primary}; */
	background-color: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	flex: 1;
	z-index: 999999;
	@media screen and (max-width: 844px) {
		position: fixed;
		background-color: #100317;
		box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.8);
		padding: 15px 0;
	}
`;

export const HeaderContainer = styled.div`
	display: flex;
	justify-content: stretch;
	align-items: stretch;
	flex-direction: row;
	flex: 1;
	max-width: 1366px;
	padding: 0 15px;
	min-height: 80px;
	/* background-color: rgba(255, 255, 255, 0.4); */
	@media screen and (max-width: 844px) {
		justify-content: stretch;
		align-items: center;
		flex-direction: column;
		min-height: 40px;
	}
	& > div {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: row;
		flex-wrap: nowrap;
		overflow-wrap: initial;
		overflow: hidden;
		&:nth-child(1) {
			flex: 4;
		}
		&:nth-child(2) {
			flex: 10;
			min-height: 100%;
		}
		&:nth-child(3) {
			flex: 5;
			justify-content: flex-end;
			gap: 15px;
		}
	}
	& > div > ul {
		transition: all 0.1s ease-in-out;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		flex: 1;
		/* background-color: rgba(0, 0, 0, 0.4); */
		margin: 0;
		padding: 0;
		list-style: none;
		gap: 35px;
		min-height: 100%;
		& > li {
			transition: all 0.1s ease-in-out;
			display: inline-block;
			padding: 10px 0;
			& > a {
				transition: all 0.1s ease-in-out;
				color: ${({ theme }) => theme.colors.text};
				display: block;
				padding: 3px 0px;
				border-radius: 2px;
				/* background-color: rgba(0, 0, 0, 0.4); */
				text-decoration: none;
				font-family: 'Syncopate', sans-serif;
				text-transform: initial;
				font-weight: 400;
				line-height: 16.66px;
				font-size: 1.2rem;
				border-bottom: 2px solid transparent;
			}
			&.actived > a {
				transition: all 0.1s ease-in-out;
				color: ${({ theme }) => theme.colors.text_primary};
				border-bottom: 2px solid ${({ theme }) => theme.colors.text_primary};
			}
			&:hover > a {
				transition: all 0.1s ease-in-out;
				text-shadow: 1px 1px 8px ${({ theme }) => theme.colors.text_shadow};
				color: ${({ theme }) => theme.colors.text_primary};
				border-bottom: 2px solid ${({ theme }) => theme.colors.text_primary};
			}
			&:focus > a {
				transition: all 0.1s ease-in-out;
				color: ${({ theme }) => theme.colors.text_secundary};
				border-bottom: 2px solid ${({ theme }) => theme.colors.text_secundary};
			}
		}
	}
`;

export const HeaderLogoArea = styled.div`
	background-color: transparent;
	padding: 0 10px 0 15px;
	& > img {
		max-width: 100%;
	}
	@media screen and (max-width: 844px) {
		justify-content: center;
		align-items: center;
	}
`;

export const HeaderMenuLinkslist = styled.div`
	background-color: transparent;
	@media screen and (max-width: 844px) {
		display: none !important;
	}
`;

export const HeaderActionsArea = styled.div`
	background-color: transparent;
	@media screen and (max-width: 844px) {
		display: none !important;
	}
`;
