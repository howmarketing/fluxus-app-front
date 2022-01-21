import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

export type ICard = HTMLAttributes<HTMLDivElement>;
export type ICardContainer = HTMLAttributes<HTMLDivElement>;

export const CardStyled = styled.div<ICard>`
	display: flex;
	justify-content: stretch;
	align-items: stretch;
	flex-direction: row;
	background-color: ${({ theme }) => (theme.title === 'LIGHT' ? '#FFFFFF' : '#FFFFFF')};
	border-radius: 8px;
	padding: 32px;
	width: 425px;
	max-width: calc(100vw - 50px);
	height: auto;
	min-height: 240px;
	margin: 5px 0;
	box-shadow: 4px 6px 16px rgba(98, 209, 180, 0.4);
`;

export const CardContainerStyled = styled.div<ICardContainer>`
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
		color: #3f3d56;
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
		color: #3f3d56;
		border: none;
		font-weight: 600;
		box-shadow: 0px 0px 0px rgba(102, 102, 119, 0);
		@media screen and (max-width: 800px) {
			width: 100%;
			min-width: auto;
		}
		&::placeholder {
			color: #666677;
		}
		&:focus-visible {
			transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
			outline: none;
			box-shadow: 2px 2px 12px rgba(82, 21, 200, 0.15);
			transform: scale(1.03);
		}
	}
`;
