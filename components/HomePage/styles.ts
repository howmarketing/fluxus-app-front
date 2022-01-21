import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

type IWrapBox = HTMLAttributes<HTMLDivElement>;
type IH1 = HTMLAttributes<HTMLHeadingElement>;
export const H1 = styled.h1<IH1>`
	display: inline-block;
	text-align: center;
	margin: 45px 0 75px 0;
	color: ${({ theme }) => theme.colors.primary_green} !important;
	font-weight: 500;
	font-size: 2.2rem;
	text-align: center;
	text-shadow: 0px 0px 3px #18efc9;
`;

export const WrapBox = styled.div`
	display: flex;
	justify-content: stretch;
	align-items: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
	overflow: clip;
	height: auto;
	min-height: 400px; // Retirar após teste. Se estiver vendo este comentário, por favor deletar a linha.
	width: 100%;
	max-width: 1244px;
	background-color: transparent;
	border-radius: 8px;
`;
