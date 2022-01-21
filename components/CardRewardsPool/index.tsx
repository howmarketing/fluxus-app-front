/* eslint-disable react/no-array-index-key */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLAttributes, ReactChildren, useEffect, useState } from 'react';
import ButtonPrimary from '@components/ButtonPrimary';
import FluxusIcon from '@assets/app/fluxus-icon.svg';
import { useNearRPCContext } from '@hooks/index';
import {
	CardRewardsStyled,
	CardRewardsContainerStyled,
	CardRewardsContentStyled,
	CardRewardsAmountContentStyled,
	CardRewardsAmountSymbolStyled,
	CardRewardsFooterStyled,
	RewardsTitle,
} from './style';

export type ICoinData = {
	icon: string;
	symbol: string;
	title: string;
	wallet: string;
	dollarsValuation: number;
	amount: number;
};
type CardRewardsProps = HTMLAttributes<HTMLDivElement> & {
	cardTitle?: string;
	cardContent?: ReactChildren;
	cardFooter?: ReactChildren;
	rewards: Array<ICoinData>;
};

export const CardRewardsPool: React.FC<CardRewardsProps> = function ({ ...props }) {
	const nearRPCContextData = useNearRPCContext();
	return (
		<CardRewardsStyled {...props}>
			<CardRewardsContainerStyled>
				<RewardsTitle>{(props?.cardTitle && props.cardTitle) || `Your Rewards`}</RewardsTitle>
				{(props?.cardContent && props?.cardContent) || (
					<>
						{props.rewards.map((token: ICoinData | undefined, index) => (
							<div key={`${token?.symbol}-${index}`}>
								{(token && (
									<CardRewardsContentStyled key={`${token.symbol}-${index}`}>
										<CardRewardsAmountContentStyled>
											<input type="text" placeholder="" value={token.amount} disabled />
											<span>{`1 ${token.symbol} = `}</span>
											<a
												href=""
												onClick={(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
													ev.preventDefault();
												}}>
												{`$${token.dollarsValuation
													.toFixed(2)
													.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`}
											</a>
										</CardRewardsAmountContentStyled>
										<CardRewardsAmountSymbolStyled>
											<img
												src={token.icon}
												alt={`${token.symbol} Icon`}
												title={`${token.symbol} Icon`}
												width={30}
											/>
											<h2>{token.symbol}</h2>
										</CardRewardsAmountSymbolStyled>
									</CardRewardsContentStyled>
								)) ||
									''}
							</div>
						))}
						<CardRewardsFooterStyled>
							<ButtonPrimary
								style={{
									width: '100%',
									minWidth: '100%',
									padding: '12px',
								}}>
								{nearRPCContextData.getWallet().isSignedIn() ? 'Claim all Rewards' : 'Connect Wallet'}
							</ButtonPrimary>
						</CardRewardsFooterStyled>
					</>
				)}
			</CardRewardsContainerStyled>
		</CardRewardsStyled>
	);
};
export default CardRewardsPool;
