import react, { HTMLAttributes } from 'react';
import styled from 'styled-components';

export type IBoxGhost = HTMLAttributes<HTMLDivElement>;
export const BoxGhostStyled = styled.div<IBoxGhost>`
	transition: all 0.2s ease-in-out;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 8px 15px;
	width: 100%;
	max-width: 1300px;
	height: auto;
	max-height: 95vh;
	overflow: auto;
	overflow-wrap: break-word;
	border-radius: 10px;
	border: solid 1px transparent;
	background-color: #100317;
	background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(60deg, #00f5cc, #f43085, #7623f5) !important;
	background-origin: border-box;
	box-shadow: -67px 236px 332px 265px #13041f inset, 32px 146px 861px 294px #1a063b inset,
		402px 106px 1011px 336px #0b0210 inset, 282px 216px 881px 325px #260438 inset;
	color: #f9f8fa;
	font-family: 'Mulish', sans-serif;
	font-size: 1rem;
	font-weight: 500;
	text-transform: none;
	text-shadow: none;
	outline: none;
	filter: none;

	&::-webkit-scrollbar:vertical {
		width: 3px;
	}
	&::-webkit-scrollbar:horizontal {
		height: 3px;
	}
	::-webkit-scrollbar-thumb:vertical {
		background-color: #f4308590;
		border-radius: 1000px;
	}
	::-webkit-scrollbar-thumb:horizontal {
		background-color: #7623f590;
		border-radius: 1000px;
	}
`;

export const BoxGhostStyledAsDark = styled(BoxGhostStyled)`
	background-color: #100317;
	background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
		linear-gradient(60deg, #00f5cc, #f43085, #7623f5) !important;
	background-origin: border-box;
	box-shadow: -67px 236px 332px 265px #13041f inset, 32px 146px 861px 294px #1a063b inset,
		402px 106px 1011px 336px #0b0210 inset, 282px 216px 881px 325px #260438 inset;
	color: #f9f8fa;
`;
