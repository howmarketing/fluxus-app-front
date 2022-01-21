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
export const SwitchArea = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 15px;
	gap: 8px;
	& > div {
		padding: 0 !important;
	}
`;
export const SwitchAreaTitle = styled.h1`
	display: inline-block;
	text-align: left;
	margin: 0;
	color: ${({ theme }) => theme.colors.text} !important;
	font-weight: 600;
	font-size: 0.8rem;
	& > span {
		font-weight: 500;
		font-family: 'Mulish', sans-serif;
		font-size: 0.85rem;
		&.selected {
			color: ${({ theme }) => theme.colors.primary_green};
		}
	}
`;
export const SwitchAreaTitleTag = styled.span`
	position: absolute;
	background-color: ${({ theme }) => theme.colors.background_primary}70 !important;
	border: 1px solid ${({ theme }) => theme.colors.primary_green};
	color: ${({ theme }) => theme.colors.primary_green};
	font-family: 'Mulish', sans-serif;
	font-size: 0.7rem;
	font-style: italic;
	font-weight: 600;
	border-radius: 6px;
	padding: 1px 7px;
	z-index: 999;
	margin-top: 0;
	margin-left: 42px;
	transform: scale(0.89);
`;
export const ListVaultsBox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 24px;
`;
