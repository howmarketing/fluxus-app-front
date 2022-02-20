/* eslint-disable no-alert */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLAttributes, ReactChildren, ReactElement, useEffect, useState } from 'react';
import ButtonPrimary from '@components/ButtonPrimary';
import FluxusIcon from '@assets/app/fluxus-icon.svg';
import { useNearRPCContext } from '@hooks/index';
import { TokenMetadata } from '@services/ft-contract';
import { IPopulatedSeed } from '@components/FarmList';
import { claimRewardBySeed, getUnclaimedReward } from '@services/farm';
import {
	CardRewardsStyled,
	CardRewardsContainerStyled,
	CardRewardsContentStyled,
	CardRewardsAmountContentStyled,
	CardRewardsAmountSymbolStyled,
	CardRewardsFooterStyled,
	CardRewardsTitleContainerStyled,
	CardRewardsContentContainerStyled,
} from './style';

export type IPopulatedReward = {
	reward_token_id: string;
	reward_token_name: string;
	total_reward: string | number;
	total_reward_default: string | number | undefined;
	reward_token_metadata: TokenMetadata;
};
type CardRewardsProps = HTMLAttributes<HTMLDivElement> & {
	cardTitle?: string;
	cardContent?: ReactChildren;
	cardFooter?: ReactElement;
	rewards?: Array<IPopulatedReward>;
	seedData?: IPopulatedSeed;
	selectedRewardFunction?: (
		rewardData: IPopulatedReward & { reward_index: number; is_selected: boolean },
	) => void | undefined;
};

export const CardRewards: React.FC<CardRewardsProps> = function ({ ...props }) {
	const nearRPCContext = useNearRPCContext();

	const handleChangeEvent = (
		ev: React.ChangeEvent<HTMLInputElement>,
		userFarmRewardToken: IPopulatedReward,
		rewardLinkIndex: number,
	) => {
		const targetIsSelected = ev?.target?.checked || false;
		if (typeof props.selectedRewardFunction === 'function') {
			const selectedRewardProperties = {
				...userFarmRewardToken,
				reward_index: rewardLinkIndex,
				is_selected: targetIsSelected,
			};
			props.selectedRewardFunction(selectedRewardProperties);
		}
	};
	return (
		<CardRewardsStyled {...props}>
			<CardRewardsTitleContainerStyled>
				{props?.cardTitle ? (
					<h1>{props.cardTitle}</h1>
				) : nearRPCContext.getWallet().isSignedIn() ? (
					<h1>Your Rewards</h1>
				) : (
					<h1
						style={{
							fontSize: '20px',
							width: '100%',
							textAlign: 'center',
							textShadow: '1px 1px 15px rgba(0,0,0,0.1)',
							fontWeight: '600',
						}}>
						Connect your wallet for you can see your rewards
					</h1>
				)}
			</CardRewardsTitleContainerStyled>
			{(props?.cardContent && (
				<CardRewardsContentContainerStyled>{props.cardContent}</CardRewardsContentContainerStyled>
			)) || (
				<CardRewardsContentContainerStyled
					style={
						(!props?.rewards?.length && { display: 'none' }) ||
						({} as React.CSSProperties & React.CSSProperties)
					}>
					{(props?.rewards || []).map((userFarmRewardToken: IPopulatedReward, index: number) => (
						<CardRewardsContentStyled key={`${userFarmRewardToken.reward_token_id}-${index}`}>
							<CardRewardsAmountContentStyled>
								{props?.selectedRewardFunction && (
									<div style={{ width: '100px', height: '0px', zIndex: '999999' }}>
										<input
											style={{ marginTop: '8px', marginLeft: '4px' }}
											type="checkbox"
											name={`reward[${userFarmRewardToken.reward_token_id}]`}
											value={`${userFarmRewardToken.reward_token_id}`}
											onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
												handleChangeEvent(ev, userFarmRewardToken, index);
											}}
										/>
									</div>
								)}
								<input
									style={
										props?.selectedRewardFunction && {
											width: 'calc(100% - 16px)',
											maxWidth: 'calc(100% - 16px)',
											minWidth: 'calc(100% - 16px)',
											marginLeft: '30px',
										}
									}
									type="text"
									placeholder="Amount"
									disabled
									value={userFarmRewardToken.total_reward}
								/>
							</CardRewardsAmountContentStyled>
							<CardRewardsAmountSymbolStyled>
								<img
									src={userFarmRewardToken.reward_token_metadata.icon || FluxusIcon}
									alt={`${userFarmRewardToken.reward_token_id} Icone`}
									title={`${userFarmRewardToken.reward_token_id} Icone`}
									width={31}
								/>
								<h2>{userFarmRewardToken.reward_token_name}</h2>
							</CardRewardsAmountSymbolStyled>
						</CardRewardsContentStyled>
					))}
				</CardRewardsContentContainerStyled>
			)}
			<CardRewardsContainerStyled>
				<CardRewardsFooterStyled>
					{props?.cardFooter && props.cardFooter}
					{!props?.cardFooter && (
						<>
							<ButtonPrimary
								style={{
									width: '100%',
									minWidth: '100%',
									padding: '12px',
								}}
								onClick={() => {
									if (!nearRPCContext.getWallet().isSignedIn()) {
										nearRPCContext
											.getWallet()
											.requestSignIn(nearRPCContext.config.REF_FARM_CONTRACT_ID);
									} else {
										(async () => {
											if (props?.seedData?.seed_id) {
												await claimRewardBySeed(props.seedData.seed_id).catch((err: any) => {
													// Error log
													console.log(err);
												});
											} else {
												alert('Could not claim rewards by seed becouse these wasnt provided');
											}
										})();
									}
								}}>
								{(nearRPCContext.getWallet().isSignedIn() && 'Claim rewards') || 'Connect wallet'}
							</ButtonPrimary>
						</>
					)}
				</CardRewardsFooterStyled>
			</CardRewardsContainerStyled>
		</CardRewardsStyled>
	);
};
export default CardRewards;
