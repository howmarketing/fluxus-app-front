import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

export type IFooter = HTMLAttributes<HTMLHtmlElement>;

export const FooterStyled = styled.footer<IFooter>`
	width: 100%;
	height: auto;
	padding: 15px 15px;
	/* background-color: ${({ theme }) => theme.colors.primary}; */
	background-color: transparent;
	display: flex;
	justify-content: stretch;
	align-items: center;
	flex-direction: row;
	flex: 1;
`;

export const FooterContainer = styled.div`
	flex: 1;
	display: flex;
	justify-content: stretch;
	align-items: center;
	flex-direction: row;
	padding: 0 15px;
	min-height: 80px;
	margin-top: 45px;
	/* background-color: rgba(255, 255, 255, 0.4); */
	& > div {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: row;
		flex-wrap: nowrap;
		overflow-wrap: initial;
		overflow: hidden;
		&:nth-child(1) {
			flex: 2;
		}
		&:nth-child(2) {
			flex: 10;
		}
		&:nth-child(3) {
			flex: 2;
			justify-content: flex-end;
			gap: 15px;
		}
	}
`;

export const FooterLogoArea = styled.div`
	background-color: transparent;
	& > img {
		max-width: 100%;
	}
`;

export const FooterMenuLinkslist = styled.div`
	background-color: transparent;
	& > ul {
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
		gap: 5px;
		min-height: 100%;
		& > li {
			transition: all 0.1s ease-in-out;
			display: inline-block;
			padding: 10px 5px;
			& > a {
				transition: all 0.1s ease-in-out;
				color: ${({ theme }) => theme.colors.text};
				display: block;
				padding: 3px 5px;
				border-radius: 2px;
				/* background-color: rgba(0, 0, 0, 0.4); */
				text-decoration: none;
				font-family: 'Syncopate', sans-serif;
				text-transform: initial;
				font-weight: 400;
				line-height: 16.66px;
				font-size: 0.8rem;
				border-bottom: 2px solid transparent;
			}
			&.actived > a {
				transition: all 0.1s ease-in-out;
				color: ${({ theme }) => theme.colors.text_primary};
				border-bottom: 1px solid ${({ theme }) => theme.colors.text_primary};
			}
			&:hover > a {
				transition: all 0.1s ease-in-out;
				transform: scale(1.04);
				text-shadow: 1px 1px 8px ${({ theme }) => theme.colors.text_shadow};
				color: ${({ theme }) => theme.colors.secondary_light_purple};
				border-bottom: 2px solid ${({ theme }) => theme.colors.secondary_light_purple};
			}
			&:focus > a {
				transition: all 0.1s ease-in-out;
				color: ${({ theme }) => theme.colors.text_secundary};
				border-bottom: 2px solid ${({ theme }) => theme.colors.text_secundary};
			}
		}
	}
`;

export const FooterActionsArea = styled.div`
	background-color: transparent;
`;
