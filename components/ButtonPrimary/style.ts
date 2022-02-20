import react, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export type IButton = ButtonHTMLAttributes<HTMLButtonElement>;
export const ButtonPrimaryStyled = styled.button<IButton>`
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	border-radius: 8px;
	border: solid 2px transparent;
	width: auto;
	max-width: 100%;
	height: 45px;
	padding: 0 12px;
	background-color: #00f5cc;
	background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(101deg, #00f5cc, #00f5cc) !important;
	background-origin: border-box;
	box-shadow: 1px 1000px 1px #048d75 inset;
	border: solid 1px transparent;
	color: #f8f8f9;
	font-family: Mulish;
	font-size: 1.1rem;
	font-weight: 600;
	text-transform: none;
	text-shadow: 1px 1px 7.5px #00000030;
	outline: none;
	filter: none;

	&:hover {
		filter: brightness(1.2);
		transform: scale(1.03);
		color: #f8f8f9;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #f43085, #7623f5) !important;
	}
	&:target,
	&:focus-within,
	&:active,
	&:focus-visible,
	&:visited {
		filter: brightness(1.1);
		color: #f8f8f9;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #f43085, #7623f5) !important;
	}
	&:active {
		filter: brightness(1.1);
		color: #f8f8f9;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #f43085, #7623f5) !important;
	}
	&:disabled {
		cursor: not-allowed;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #565656, #565656) !important;
		box-shadow: 1px 1000px 1px #565656 inset;
	}
`;

export const ButtonPrimaryStyledAsDark = styled(ButtonPrimaryStyled)`
	background-color: #00f5cc;
	background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(101deg, #00f5cc, #00f5cc) !important;
	background-origin: border-box;
	box-shadow: 1px 1000px 1px #048d75 inset;
	border: solid 1px transparent;
	color: #f8f8f9;
	&:hover {
		color: #f8f8f9;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #f43085, #7623f5) !important;
	}

	&:target,
	&:focus-within,
	&:active,
	&:focus-visible,
	&:visited {
		color: #f8f8f9;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #f43085, #7623f5) !important;
	}
	&:active {
		color: #f8f8f9;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #f43085, #7623f5) !important;
	}
	&:disabled {
		cursor: not-allowed;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #565656, #565656) !important;
		box-shadow: 1px 1000px 1px #565656 inset;
	}
`;
