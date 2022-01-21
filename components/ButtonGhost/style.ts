import react, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export type IButton = ButtonHTMLAttributes<HTMLButtonElement>;
export const ButtonGhostStyled = styled.button<IButton>`
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	border-radius: 8px;
	border: solid 2px transparent;
	width: auto;
	max-width: 100%;
	height: 45px;
	padding: 0 12px;
	background-color: #100317;
	background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(101deg, #00f5cc, #7623f5) !important;
	background-origin: border-box;
	box-shadow: 2px 1000px 1px #100317 inset;
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

export const ButtonGhostStyledAsDark = styled(ButtonGhostStyled)`
	background-color: #100317;
	background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(101deg, #00f5cc, #7623f5) !important;
	background-origin: border-box;
	box-shadow: 2px 1000px 1px #100317 inset;
	color: #f9f8fa;
	&:hover {
		color: #00f5cc;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #f43085, #7623f5, #00f5cc) !important;
	}

	&:target,
	&:focus-within,
	&:active,
	&:focus-visible,
	&:visited {
		color: #7623f5;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #f43085, #00f5cc) !important;
	}
	&:active {
		color: #f43085;
		background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
			linear-gradient(101deg, #7623f5, #00f5cc, #f43085) !important;
	}
`;
