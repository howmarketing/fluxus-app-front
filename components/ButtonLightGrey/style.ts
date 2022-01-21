import react, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export type IButton = ButtonHTMLAttributes<HTMLButtonElement>;
export const ButtonLightGreyStyled = styled.button<IButton>`
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	border-radius: 8px;
	border: solid 2px transparent;
	width: auto;
	max-width: 100%;
	height: 45px;
	padding: 0 12px;
	background-color: #d5d5d8;
	background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(101deg, #d5d5d8, #d5d5d8) !important;
	background-origin: border-box;
	box-shadow: 2px 1000px 1px #d5d5d8 inset;
	color: #212121;
	font-family: 'Mulish', sans-serif;
	font-size: 1.1rem;
	font-weight: 600;
	text-transform: none;
	text-shadow: none;
	outline: none;
	filter: none;

	&:hover {
		filter: brightness(1.2);
		transform: scale(1.03);
		color: #212121;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #00f5cc, #7623f5) !important;
	}
	&:target,
	&:focus-within,
	&:active,
	&:focus-visible,
	&:visited {
		filter: brightness(1.1);
		color: #212121;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #00f5cc, #7623f5) !important;
	}
	&:active {
		filter: brightness(1.1);
		color: #212121;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #00f5cc, #7623f5) !important;
	}
`;

export const ButtonLightGreyStyledAsDark = styled(ButtonLightGreyStyled)`
	background-color: #d5d5d8;
	background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(101deg, #d5d5d8, #d5d5d8) !important;
	background-origin: border-box;
	box-shadow: 2px 1000px 1px #d5d5d8 inset;
	color: #212121;
	&:hover {
		color: #212121;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #00f5cc, #7623f5) !important;
	}
	&:target,
	&:focus-within,
	&:active,
	&:focus-visible,
	&:visited {
		color: #212121;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #00f5cc, #7623f5) !important;
	}
	&:active {
		color: #212121;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #00f5cc, #7623f5) !important;
	}
`;
