import react, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export type IButton = ButtonHTMLAttributes<HTMLButtonElement>;
export const ButtonBlindStyled = styled.button<IButton>`
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	border-radius: 8px;
	border: solid 2px transparent;
	width: auto;
	max-width: 100%;
	height: 45px;
	padding: 0 12px;
	background-color: transparent;
	background-image: none;
	background-origin: unset;
	box-shadow: none;
	color: #212121;
	font-family: 'Mulish', sans-serif;
	font-size: 1.1rem;
	font-weight: 600;
	text-transform: none;
	text-shadow: none;
	outline: none;
	filter: none;

	&:hover {
		filter: none;
		transform: none;
		color: #212121;
		background-image: none;
	}
	&:target,
	&:focus-within,
	&:active,
	&:focus-visible,
	&:visited {
		filter: none;
		color: #212121;
		background-image: none;
	}
	&:active {
		filter: none;
		color: #212121;
		background-image: none;
	}
`;

export const ButtonBlindStyledAsDark = styled(ButtonBlindStyled)`
	background-color: transparent;
	background-image: none;
	background-origin: unset;
	box-shadow: none;
	color: #7623f5;
	&:hover {
		color: #7623f5;
		background-image: none;
	}
	&:target,
	&:focus-within,
	&:active,
	&:focus-visible,
	&:visited {
		color: #7623f5;
		background-image: none;
	}
	&:active {
		color: #7623f5;
		background-image: none;
	}
`;
