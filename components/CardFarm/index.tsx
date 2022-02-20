/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable arrow-body-style */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ReactChild, ReactElement, useEffect, useState, HTMLAttributes, ChangeEvent } from 'react';
import Img from 'next/image';
import uxusIcon from '@assets/app/uxus.svg';
import WhatThisMeanIcon from '@assets/app/what-this-mean-icon.svg';
import PolygonIcon from '@assets/app/polygon.svg';
import CardRewards, { IPopulatedReward } from '@components/CardRewards';
import { useDarkMode, useNearRPCContext } from '@hooks/index';
import { IPopulatedSeed } from '@components/FarmList';
import { IFarmData } from '@workers/workerNearPresets';
import { TokenMetadata } from '@services/ft-contract';
import ButtonPrimary from '@components/ButtonPrimary';
import ButtonGhost from '@components/ButtonGhost';
import { getMftTokenId } from '@utils/token';
import { stake, unstake } from '@services/m-token';
import { claimRewardBySeed, getRewardByTokenId, getUnclaimedReward } from '@services/farm';
import { toNonDivisibleNumber, toReadableNumber } from '@utils/numbers';
import { IDarkModeContext } from '@contexts/darkMode';
import { nearWalletAsWindow } from '@utils/nearWalletAsWindow';
import { INearRPCContext } from '@contexts/nearData/nearRPCData';
import {
	CardFarmAreaStyled,
	CardContainerStyled,
	CardHeader,
	CardHeaderCoinPairsIcon,
	CardHeaderCoinPairsLabel,
	CardHeaderEarned,
	CardHeaderMultiplier,
	CardHeaderTotalValueLocked,
	CardHeaderAPYX,
	CardHeaderDropDown,
	CardBody,
	CardBodyTabs,
	CardBodyTabsContent,
	CardBodyTabsContentItem,
} from './style';

export type ITabProperties = {
	tabTitle: string | number | ReactChild | Symbol;
	tabContent: string | number | ReactChild | Symbol;
	actived?: boolean | undefined;
};
export type ICoinData = {
	icon: string;
	symbol: string;
	title: string;
	wallet: string;
	dollarsValuation: number;
	amount: number;
};
export type ICardFarmState = {
	populatedSeed: IPopulatedSeed;
	useFluxusFarmContract?: boolean | undefined;
};
export type ICardFarmProps = HTMLAttributes<HTMLDivElement> & ICardFarmState;

export const CardFarm = (props: ICardFarmProps): ReactElement => {
	const { populatedSeed, useFluxusFarmContract } = props;
	const [useFluxusFarmContractState, setUseFluxusFarmContractState] = useState<boolean>(false);
	const [cardToggleState, setCardToggleState] = useState<'opened' | 'closed'>('closed');
	const [tabActivedState, setTabActivedState] = useState<number>(0);

	const toggleCardStatus = () => setCardToggleState(cardToggleState === 'closed' ? 'opened' : 'closed');
	const TabsHeader = (props: { populatedSeed: IPopulatedSeed; activedTabIndex: number }) => {
		const { populatedSeed, activedTabIndex } = props;
		const tabsProps = [
			// { title: 'Management', isActive: activedTabIndex === 0 },
			{ title: 'Info', isActive: activedTabIndex === 0 },
		];
		return (
			<DisplayerCardBodyTabsHeader
				populatedSeed={populatedSeed}
				tabs={tabsProps}
				setTabActivedState={setTabActivedState}
			/>
		);
	};
	useEffect(() => {
		setUseFluxusFarmContractState(typeof useFluxusFarmContract !== 'undefined' ? useFluxusFarmContract : false);
		return () => {
			setUseFluxusFarmContractState(false);
		};
	}, []);
	return (
		<CardFarmAreaStyled {...props} title={getCardTitle(populatedSeed)} data-status={cardToggleState}>
			<CardHeader data-keyname="CardHeader" onClick={(ev: any) => toggleCardStatus()}>
				<CardContainerStyled data-keyname="CardHeaderContainerStyled" title="Card Container">
					<DisplayerPoolCoinGroupIcons populatedSeed={populatedSeed} />
					<DisplayerFarmLabel populatedSeed={populatedSeed} />
					<DisplayerFarmEarned populatedSeed={populatedSeed} />
					<DisplayerFarmTotalUnClaimedReward populatedSeed={populatedSeed} />
					<DisplayerFarmTotalValueLocked populatedSeed={populatedSeed} />
					<DisplayerFarmEarnType populatedSeed={populatedSeed} />
					<DisplayerFarmDropDownButton />
				</CardContainerStyled>
			</CardHeader>
			<CardBody data-kleyname="CardBodyArea" title="Card body area">
				<CardContainerStyled data-keyname="CardBodyContainerStyled" title="Card Container">
					<TabsHeader populatedSeed={populatedSeed} activedTabIndex={tabActivedState} />
					<CardBodyTabsContent data-keyname="CardBodyTabsContent" title="Card body tabs content area">
						{/* <DisplayerCardBodyTabBodyForManagment
							populatedSeed={populatedSeed}
							isActive={tabActivedState === 0}
						/> */}
						<DisplayerCardBodyTabBodyForInfo
							populatedSeed={populatedSeed}
							isActive={tabActivedState === 0}
						/>
						<DisplayerCardBodyRewards
							populatedSeed={populatedSeed}
							useFluxusFarmContractState={useFluxusFarmContractState}
						/>
					</CardBodyTabsContent>
				</CardContainerStyled>
			</CardBody>
		</CardFarmAreaStyled>
	);
};

export const getCardTitle = (populatedSeed: IPopulatedSeed) => {
	const poolSymbols = populatedSeed.pool.populated_tokens
		.map((tokenData: TokenMetadata, index: number) => `${tokenData.symbol}`)
		.join(' - ');
	return `${poolSymbols}`;
};

export type ICardFarmRewardFooter = {
	populatedSeed: IPopulatedSeed;
	useFluxusFarmContract?: boolean | undefined;
	loadCardRewards?: (updateRewardsValues?: boolean) => Promise<any>;
	setStateRewardsIsLoading?: (value: React.SetStateAction<boolean>) => void;
};

export const CardFarmRewardFooter = ({ ...FooterProps }: ICardFarmRewardFooter) => {
	const themeProvided = useDarkMode();
	const nearRPCContext = useNearRPCContext();
	const { populatedSeed, useFluxusFarmContract, loadCardRewards, setStateRewardsIsLoading } = FooterProps;
	const total_staked = typeof populatedSeed.user_staked_amount !== `undefined` ? populatedSeed.user_staked_amount : 0;
	const total_lptoken =
		typeof populatedSeed.pool.shares_lptoken !== `undefined` ? populatedSeed.pool.shares_lptoken : 0;
	const { seed_id } = populatedSeed;
	const [walletIsSignedState, setWalletIsSignedState] = useState<boolean>(false);

	const claimAllFarmedRewardTokens = async (seed_id: string) => {
		try {
			if (typeof setStateRewardsIsLoading === 'function') {
				setStateRewardsIsLoading(true);
			}
			nearWalletAsWindow._makeItWaitBeforeClose = 2000;
			const windowWalletProvider = await nearWalletAsWindow.getWindowWalletRPC<INearRPCContext>();
			await windowWalletProvider
				.getNearPresets()
				.claime_user_rewards_by_seed(seed_id, useFluxusFarmContract)
				.catch((err: any) => {
					// Error log
					console.log('claimAllFarmedRewardTokens:(error) ', err?.message || 'unknown error');
				});
			const walletResponse = await nearWalletAsWindow.getWalletCallback(30000);
			if (!walletResponse.success) {
				window.alert(walletResponse.message);
			}
			if (typeof loadCardRewards === 'function') {
				await loadCardRewards(true);
			}
			if (typeof setStateRewardsIsLoading === 'function') {
				setStateRewardsIsLoading(false);
			}
		} catch (e: any) {
			window.alert(e?.message || '');
		}
	};

	// Button component for unstake from the farm the user staked lptokens
	const UnstakeButton = ({ ...props }: { populatedSeed: IPopulatedSeed }) => {
		const { populatedSeed } = props;
		const total_staked = populatedSeed?.user_staked_amount || 0;
		return (
			<ButtonGhost
				disabled={!total_staked}
				style={{
					display: walletIsSignedState ? 'block' : 'none',
					width: 'auto',
					minWidth: '100px',
					boxShadow: `2px 1000px 1px #121212 inset`,
					opacity: `${!total_staked ? '0.4' : '1'}`,
				}}
				onClick={ev => {
					openModalUnstake({
						themeProvided,
						total_staked,
						populatedSeed,
						useFluxusFarmContract: useFluxusFarmContract || false,
					});
					// doUnstake(`${amount}`, seed_id);
				}}>
				Unstake{' '}
				<small
					style={{
						fontSize: '9px',
						fontStyle: 'italic',
						position: 'absolute',
						marginTop: '-18px',
						backgroundColor: '#00f5cc',
						borderRadius: '4px',
						padding: '2px 5px',
						color: '#212121',
						fontWeight: '800',
						boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.6)',
					}}>
					{parseFloat(toReadableNumber(24, `${total_staked}`)).toFixed(3)}
				</small>
			</ButtonGhost>
		);
	};

	// Button component for stake user lptokens for the farm
	const StakeButton = ({ ...props }: { total_lptoken: number; seed_id: string }) => {
		const { total_lptoken } = props;
		return (
			<ButtonGhost
				disabled={!`${total_lptoken}`.length}
				style={{
					display: walletIsSignedState ? 'block' : 'none',
					width: 'auto',
					minWidth: '100px',
					boxShadow: `2px 1000px 1px #121212 inset`,
					opacity: `${`${total_lptoken}`.length < 1 || `${total_lptoken}` === '0' ? '0.4' : '1'}`,
				}}
				onClick={ev => {
					if (`${total_lptoken}`.length > 0 && `${total_lptoken}` !== '0') {
						openModalStake({
							themeProvided,
							populatedSeed,
							total_available_to_staked: total_lptoken,
							useFluxusFarmContract: useFluxusFarmContract || false,
						});
					}
				}}>
				Stake{' '}
				<small
					style={{
						fontSize: '9px',
						fontStyle: 'italic',
						position: 'absolute',
						marginTop: '-18px',
						backgroundColor: '#00f5cc',
						borderRadius: '4px',
						padding: '2px 5px',
						color: '#212121',
						fontWeight: '800',
						boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.6)',
					}}>
					{`${parseFloat(toReadableNumber(24, `${total_lptoken}`)).toFixed(3)}`}
				</small>
			</ButtonGhost>
		);
	};

	// Button component for claim all reward tokens earned while farming with user lptokens
	const ClaimAllButton = ({ ...props }: { total_staked: number; seed_id: string }) => {
		const { total_staked } = props;
		return (
			<ButtonPrimary
				disabled={!total_staked}
				style={{
					display: walletIsSignedState ? 'flex' : 'none',
					width: 'auto',
					minWidth: '100px',
					justifyContent: 'center',
					alignItems: 'center',
					flex: '1',
					opacity: `${!total_staked ? '0.4' : '1'}`,
				}}
				onClick={() => {
					if (total_staked) {
						claimAllFarmedRewardTokens(seed_id);
					}
				}}>
				Claim All Rewards
			</ButtonPrimary>
		);
	};

	// Button component to trigger the connect wallet function from the near RPC connection interface
	const ConnectWalletButton = () => (
		<ButtonPrimary
			style={{
				display: walletIsSignedState ? 'none' : 'block',
				width: '100%',
				minWidth: '100%',
			}}
			onClick={() => {
				nearRPCContext.getWallet().requestSignIn(nearRPCContext.config.FLUXUS_VAULT_CONTRACT_ID);
			}}>
			Connect wallet
		</ButtonPrimary>
	);

	useEffect(() => {
		setWalletIsSignedState(nearRPCContext.getWallet().isSignedIn());
		return () => {
			setWalletIsSignedState(false);
		};
	}, []);

	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				justifyContent: 'stretch',
				alignItems: 'center',
				flexDirection: 'row',
				gap: '10px',
				flexWrap: 'wrap',
			}}>
			<UnstakeButton populatedSeed={populatedSeed} />
			<StakeButton total_lptoken={total_lptoken} seed_id={seed_id} />
			<ClaimAllButton total_staked={Number(total_staked)} seed_id={seed_id} />
			<ConnectWalletButton />
		</div>
	);
};

export const formatMoney = (amount: number) => amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

export const formatMoneyWithShortName = (amount: string) => {
	try {
		const shortValueParts = amount.split(',');
		const shortValueCount = shortValueParts.length;
		const shortValueName =
			shortValueCount >= 6
				? `Q`
				: shortValueCount >= 5
				? `T`
				: shortValueCount >= 4
				? `B`
				: shortValueCount >= 3
				? 'M'
				: shortValueCount >= 2
				? 'K'
				: '';
		return `${shortValueParts.slice(0, 1).join('')}${
			shortValueCount < 2 ? '' : `.${shortValueParts.slice(1, 2).join('').substring(0, 1)}`
		}${shortValueName}`;
	} catch (e: any) {
		console.error(e);
		return amount;
	}
};

export const DisplayerPoolCoinGroupIcons = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	return (
		<CardHeaderCoinPairsIcon
			data-keyname="CardHeaderPoolCoinGroupIcons"
			title="Card Header pool coin group - icons">
			{populatedSeed.pool.populated_tokens.map((tokenData: TokenMetadata, index: number) => (
				<img
					key={`${tokenData.id}`}
					src={tokenData.icon || uxusIcon}
					alt={`${tokenData.name} (${tokenData.symbol}) icon`}
					title={`${tokenData.name} (${tokenData.symbol}) icon`}
					width={32}
					height={32}
				/>
			))}
		</CardHeaderCoinPairsIcon>
	);
};

export const DisplayerFarmLabel = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	return (
		<CardHeaderCoinPairsLabel data-keyname="CardHeaderCoinPairsLabel" title="Card Header coin pairs - label">
			<h3>{getCardTitle(populatedSeed)}</h3>
		</CardHeaderCoinPairsLabel>
	);
};

export const DisplayerFarmEarned = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	return (
		<CardHeaderEarned data-keyname="CardHeaderEarned" title="Card Header Earned" style={{ display: 'none' }}>
			<label htmlFor="Earned">Earned</label>
			<span>$ {formatMoneyWithShortName(formatMoney(0))}</span>
		</CardHeaderEarned>
	);
};

export const DisplayerFarmTotalReward = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	const totalFarmsReward = ((totalReward = 0) => {
		populatedSeed.populated_farms.map((PopulatedFarm: IFarmData, indexFarm: number) => {
			totalReward += Math.abs(
				parseFloat(
					toReadableNumber(
						parseInt(`${PopulatedFarm.token_details.decimals}`, 10),
						`${PopulatedFarm.total_reward}`,
					),
				),
			);
			return PopulatedFarm.total_reward;
		});
		return totalReward;
	})();
	return (
		<CardHeaderEarned data-keyname="CardHeaderEarned" title="Card Header Total Farm Rewards">
			<label htmlFor="Total Farm Rewards">TFRw</label>
			<span>$ {formatMoneyWithShortName(formatMoney(totalFarmsReward))}</span>
		</CardHeaderEarned>
	);
};

export const DisplayerFarmTotalClaimedReward = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	const totalFarmClaimedReward = ((totalClaimedReward = 0) => {
		populatedSeed.populated_farms.map((PopulatedFarm, indexFarm: number) => {
			totalClaimedReward += Math.abs(
				parseFloat(
					toReadableNumber(
						parseInt(`${PopulatedFarm.token_details.decimals}`, 10),
						`${PopulatedFarm.claimed_reward}`,
					),
				),
			);
			return PopulatedFarm.claimed_reward;
		});
		return totalClaimedReward;
	})();
	return (
		<CardHeaderEarned data-keyname="CardHeaderEarned" title="Card Header Total Farm Claimed Rewards">
			<label htmlFor="Total Farm Claimed Rewards">TFCRw</label>
			<span>$ {formatMoneyWithShortName(formatMoney(totalFarmClaimedReward))}</span>
		</CardHeaderEarned>
	);
};

export const DisplayerFarmTotalUnClaimedReward = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	const totalFarmUnclaimedReward = ((totalUnclaimedReward = 0) => {
		populatedSeed.populated_farms.map((PopulatedFarm, indexFarm: number) => {
			totalUnclaimedReward += Math.abs(
				parseFloat(
					toReadableNumber(
						parseInt(`${PopulatedFarm.token_details.decimals}`, 10),
						`${PopulatedFarm.unclaimed_reward}`,
					),
				),
			);
			return PopulatedFarm.unclaimed_reward;
		});
		return totalUnclaimedReward;
	})();
	return (
		<CardHeaderEarned data-keyname="CardHeaderEarned" title="Total Farm Unclaimed Rewards">
			<label htmlFor="Total Farm Unclaimed Rewards">Unclaimed Rewards</label>
			<span>$ {formatMoneyWithShortName(formatMoney(totalFarmUnclaimedReward))}</span>
		</CardHeaderEarned>
	);
};

export const DisplayerFarmTotalValueLocked = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	const tvl = toReadableNumber(`${populatedSeed.min_deposit}`.length, populatedSeed.amount);
	const tvlNumber = Number(tvl);
	return (
		<CardHeaderTotalValueLocked data-keyname="CardHeaderTotalValueLocked" title="Card Header Total value locked">
			<label htmlFor="Total value locked">Total Value Locked</label>
			<span>$ {formatMoneyWithShortName(formatMoney(tvlNumber))}</span>
		</CardHeaderTotalValueLocked>
	);
};

export const DisplayerFarmEarnType = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	return (
		<CardHeaderAPYX data-keyname="CardHeaderAPYX" title="Card Header earn model">
			<label htmlFor="APx type monetization">APR</label>
			<span>7.9%</span>
		</CardHeaderAPYX>
	);
};

export const DisplayerFarmDropDownButton = () => (
	<CardHeaderDropDown>
		<Img
			src={PolygonIcon}
			alt="Toggle card farm informations"
			title="Toggle card farm informations"
			width={10}
			height={10}
			layout="fixed"
		/>
	</CardHeaderDropDown>
);

export const DisplayerCardBodyTabsHeader = (props: {
	populatedSeed: IPopulatedSeed;
	tabs: Array<{ title: string; isActive: boolean }>;
	setTabActivedState: (tabIndex: number) => void;
}) => {
	const { populatedSeed, tabs, setTabActivedState } = props;
	return (
		<CardBodyTabs data-keyname="CardBodyTabs" title="Card body tabs area">
			<ul>
				{tabs.map((tab: { title: string; isActive: boolean }, index: number) => (
					<li key={`${tab.title}-${index + 1}`} className={tab.isActive ? 'active' : ''}>
						<a
							href={`#${index}`}
							onClick={(ev: any) => {
								ev.preventDefault();
								setTabActivedState(index);
							}}>
							{tab.title}
						</a>
					</li>
				))}
			</ul>
		</CardBodyTabs>
	);
};

export const DisplayerCardBodyTabBodyForManagment = (props: { populatedSeed: IPopulatedSeed; isActive: boolean }) => {
	const { populatedSeed, isActive } = props;
	return (
		<>
			<CardBodyTabsContentItem className={isActive ? 'active' : ''} style={{ maxWidth: 'calc(50% - 15px)' }}>
				<h1>Management tab content</h1>
				<p>
					Manage {getCardTitle(populatedSeed)} LP Token into Fluxus Farm to start to earn reward tokens
					including UXU.
				</p>
			</CardBodyTabsContentItem>
		</>
	);
};

export const DisplayerCardBodyTabBodyForInfo = (props: { populatedSeed: IPopulatedSeed; isActive: boolean }) => {
	const { populatedSeed, isActive } = props;
	return (
		<>
			<CardBodyTabsContentItem className={isActive ? 'active' : ''} style={{ maxWidth: 'calc(50% - 15px)' }}>
				<h1>ABOUT</h1>
				<p>
					Deposit {getCardTitle(populatedSeed)} LP Token into Fluxus Farm to start to earn reward tokens
					including UXU.
				</p>
				<p>The deposit and staking all will happen in just one transaction.</p>
				<p>
					Earn shares of{' '}
					{((Farms: Array<IFarmData>) =>
						Farms.map((Farm: IFarmData) => (
							<span key={`${Farm.farm_id}-${Farm.token_details.id}`}>
								{Farm.token_details.symbol}
								{` `}
							</span>
						)))(populatedSeed.populated_farms)}{' '}
					and UXU rewards by depositing <span>{getCardTitle(populatedSeed)}</span>.{' '}
				</p>
				<ul>
					<li>
						<a href="#Platform">Platform</a>
						<ul>
							<li>Fluxus: AMM and DEX</li>
							<li>REF-FI: DEX</li>
						</ul>
					</li>
					<li>
						<a href="#Platform">Pool</a>
						<ul>
							{populatedSeed.pool.populated_tokens.map((Token: TokenMetadata, index: number) => (
								<li
									key={`${Token.id}-${index}`}
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										flexDirection: 'row',
									}}>
									<img
										src={Token.icon}
										alt={`Token ${Token.symbol} - icon`}
										title={`Token ${Token.symbol} - icon`}
										width={28}
									/>
									&nbsp;
									{` ${Token.symbol}`}
								</li>
							))}
						</ul>
					</li>
					<li>
						<a href="#rewards">Farm Rewards</a>
						<ul>
							{populatedSeed.populated_farms.map((Farm: IFarmData, index: number) => (
								<li
									key={`${Farm.farm_id}-${index}`}
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										flexDirection: 'row',
									}}>
									<img
										src={Farm.token_details.icon}
										alt={`Token ${Farm.token_details.symbol} - icon`}
										title={`Token ${Farm.token_details.symbol} - icon`}
										width={28}
									/>
									&nbsp;
									{` ${Farm.token_details.symbol}`}
								</li>
							))}
						</ul>
					</li>
					<li>
						<a href="#Platform">Fluxus Fees</a>
						<ul>
							<li>Withdraw fee: 0%</li>
							<li>
								Performance fee: 16,00%&nbsp;&nbsp;
								<img
									src={WhatThisMeanIcon}
									alt="What this mean?"
									title="What this mean?"
									width={12}
									height={12}
								/>
							</li>
						</ul>
					</li>
				</ul>
			</CardBodyTabsContentItem>
		</>
	);
};

export const DisplayerCardBodyRewards = (props: {
	populatedSeed: IPopulatedSeed;
	useFluxusFarmContractState: boolean;
}) => {
	const nearRPCContext = useNearRPCContext();
	const { populatedSeed, useFluxusFarmContractState } = props;
	const [stateRewardsIsLoading, setStateRewardsIsLoading] = useState<boolean>(true);
	const [rewardsStateList, setRewardsStateList] = useState<Array<IPopulatedReward>>([] as IPopulatedReward[]);

	const getCardRewardTitle = () => {
		const title = nearRPCContext.getWallet().isSignedIn() ? `Your Rewards` : `Farm not staked`;
		return `${title} | ${getCardTitle(populatedSeed)}`;
	};

	const updateFarmDataRewardValue = async (farmData: IFarmData) => {
		farmData.user_reward = await getRewardByTokenId(
			farmData.token_details.id,
			undefined,
			useFluxusFarmContractState,
		);
		farmData.user_unclaimed_reward = await getUnclaimedReward(
			farmData.farm_id,
			undefined,
			useFluxusFarmContractState,
		);
		return farmData;
	};

	const formatFarmDataAsPopulatedReward = async (
		farmData: IFarmData,
		updateRewardValues: boolean = false,
	): Promise<IPopulatedReward> => {
		farmData = updateRewardValues ? await updateFarmDataRewardValue(farmData) : farmData;
		return {
			reward_token_id: farmData.token_details.id,
			reward_token_name: farmData.token_details.symbol,
			reward_token_metadata: {
				...farmData.token_details,
				ref: 1, // Dollar token price
			},
			total_reward_default: farmData?.user_unclaimed_reward ? farmData.user_unclaimed_reward : 0,
			total_reward: farmData?.user_unclaimed_reward
				? toReadableNumber(farmData.token_details.decimals, farmData.user_unclaimed_reward)
				: '0',
		};
	};

	const loadCardRewards = async (updateRewardsValues: boolean = false): Promise<void> => {
		setStateRewardsIsLoading(true);
		try {
			const rewardsList = await Promise.all(
				populatedSeed.populated_farms.map(async (farm: IFarmData) =>
					formatFarmDataAsPopulatedReward(farm, updateRewardsValues),
				),
			);
			setRewardsStateList(rewardsList);
			setStateRewardsIsLoading(false);
		} catch (e: any) {
			console.error(e);
			setRewardsStateList([] as Array<IPopulatedReward>);
			setStateRewardsIsLoading(false);
		}
	};

	useEffect(() => {
		const DOMLoaded: boolean = true;
		(async () => {
			if (DOMLoaded) {
				loadCardRewards();
			}
		})();
		return () => {
			setRewardsStateList([] as Array<IPopulatedReward>);
			setStateRewardsIsLoading(false);
		};
	}, []);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '50%',
			}}>
			<CardRewards
				cardTitle={getCardRewardTitle()}
				seedData={populatedSeed}
				rewards={rewardsStateList}
				style={{
					transition: 'all 0.2s linear',
					boxShadow: 'none',
					backgroundColor: '#101010',
					opacity: `${stateRewardsIsLoading ? '0.5' : '1'}`,
					cursor: `${stateRewardsIsLoading ? 'not-allowed' : 'default'}`,
					width: '100%',
				}}
				cardFooter={
					<CardFarmRewardFooter
						populatedSeed={populatedSeed}
						useFluxusFarmContract={useFluxusFarmContractState}
						loadCardRewards={loadCardRewards}
						setStateRewardsIsLoading={setStateRewardsIsLoading}
					/>
				}
			/>
		</div>
	);
};

const openModalUnstake = ({
	...props
}: {
	themeProvided: IDarkModeContext;
	total_staked: number | string;
	populatedSeed: IPopulatedSeed;
	useFluxusFarmContract: boolean;
}) => {
	const { themeProvided, total_staked, populatedSeed, useFluxusFarmContract } = props;
	themeProvided.modal.setModalProps({
		isActived: true,
		header: <ModalUnstakeHeader />,
		content: (
			<ModalUnstakeContent
				totalStaked={total_staked}
				populatedSeed={populatedSeed}
				useFluxusFarmContract={useFluxusFarmContract}
			/>
		),
		footer: (
			<ModalUnstakeFooter
				totalStaked={total_staked}
				populatedSeed={populatedSeed}
				useFluxusFarmContract={useFluxusFarmContract}
			/>
		),
	});
};

const ModalUnstakeHeader = () => (
	<>
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
			}}>
			<h1 style={{ fontWeight: 'regular', fontSize: '1.1rem', margin: '0', width: '100%', textAlign: 'center' }}>
				Unstake Your Rewards
			</h1>
		</div>
	</>
);

const ModalUnstakeContent = (props: {
	totalStaked: number | string;
	populatedSeed: IPopulatedSeed;
	useFluxusFarmContract: boolean;
}) => {
	const themeProvided = useDarkMode();
	const { totalStaked, populatedSeed, useFluxusFarmContract } = props;
	const [unstakeValue, setUnstakeValue] = useState<string>('');
	const [unstakeInputValue, setUnstakeInputValue] = useState<string>('');

	const formatReadableAmountValue = (unstakeInputValue: number | string, decimals = 24) => {
		const amount: string = toReadableNumber(decimals, toNonDivisibleNumber(decimals, `${unstakeInputValue}`));
		const [wholeNumber, decimalNumber] = amount.split('.');
		const decimalsLength = decimals - (wholeNumber.length - 1);
		const paddedDecimalNumber = decimalNumber
			? decimalNumber.padEnd(decimalsLength, `0`)
			: `0`.padEnd(decimalsLength, `0`);
		return `${wholeNumber}.${paddedDecimalNumber}`;
	};

	const updateModalValues = (totalToUnstake: number | string) => {
		const amount: string = toReadableNumber(24, toNonDivisibleNumber(24, `${totalToUnstake || '0'}`));
		themeProvided.modal.setModalProps({
			isActived: true,
			header: themeProvided.modal.modalProps.header,
			content: themeProvided.modal.modalProps.content,
			footer: (
				<ModalUnstakeFooter
					populatedSeed={populatedSeed}
					totalStaked={amount}
					useFluxusFarmContract={useFluxusFarmContract}
				/>
			),
		});
	};

	useEffect(() => {
		const DOMLoaded = true;
		let timeToUpdateValue = setTimeout(() => {}, 10);
		(async () => {
			if (DOMLoaded) {
				if (unstakeInputValue.length > 0 && unstakeInputValue !== unstakeValue) {
					const formatedAmount = formatReadableAmountValue(unstakeInputValue);
					const amountIsLowerThenTotalInStake =
						Number(formatedAmount) <= Number(toReadableNumber(24, `${totalStaked}`));
					const amount = amountIsLowerThenTotalInStake
						? formatedAmount
						: toReadableNumber(24, `${totalStaked}`);
					timeToUpdateValue = setTimeout(() => {
						setUnstakeInputValue(amount);
					}, 2000);
					setUnstakeValue(amount);
					updateModalValues(amount);
				}
			}
		})();
		return () => {
			clearTimeout(timeToUpdateValue);
		};
	}, [unstakeInputValue]);

	useEffect(() => {
		setUnstakeInputValue(toReadableNumber(24, `${totalStaked}`));
		return () => {
			setUnstakeInputValue(toReadableNumber(24, `0`));
		};
	}, []);
	return (
		<>
			<div
				style={{
					position: 'relative',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexDirection: 'row',
					flexWrap: 'nowrap',
					gap: '8px',
					width: '100%',
					minHeight: '190px',
				}}>
				<input
					type="text"
					placeholder="0.00"
					style={{
						flex: '1',
						height: '45px',
						fontSize: '16px',
						borderRadius: '8px',
						backgroundColor: '#111111',
						border: '1px solid #63cdb4',
						boxShadow: `0px 0px 15px rgba(0, 0, 0, 0.02)`,
						padding: `0 60px 0 10px`,
						color: '#FFFFFF',
					}}
					value={unstakeInputValue}
					onChange={(ev: ChangeEvent<HTMLInputElement>) => {
						const value = ev.target.value.length > 0 ? ev.target.value : `0`;
						if (value.slice(-1) === '.') {
							setUnstakeInputValue(value);
							return;
						}
						const matchNumbers = value.match(/\d+/g);
						const amount = matchNumbers ? matchNumbers.splice(0, 2).join('.') : value;
						setUnstakeInputValue(amount);
					}}
				/>
				<span
					style={{
						border: 'none',
						borderLeft: '1px solid #63cdb4',
						height: '45px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'row',
						flexWrap: 'nowrap',
						width: '60px',
						position: 'absolute',
						right: '1px',
					}}
					onClick={(ev: any) => {
						setUnstakeInputValue(toReadableNumber(24, `${totalStaked}`));
					}}>
					MAX
				</span>
			</div>
		</>
	);
};
const ModalUnstakeFooter = (props: {
	totalStaked: number | string;
	populatedSeed: IPopulatedSeed;
	useFluxusFarmContract: boolean;
}) => {
	const { totalStaked, populatedSeed, useFluxusFarmContract } = props;
	const doUnstake = async (amount: string, seed_id: string | number): Promise<any> => {
		const unstakeValues = {
			seed_id: `${seed_id}`,
			amount,
			useFluxusFarmContract,
		};
		await unstake(unstakeValues).catch((error: any) => {
			// Error log
			console.log('Stake error: ', error);
		});
		return unstakeValues;
	};
	return (
		<>
			<div style={{ width: '100%', padding: '0x' }}>
				<ButtonPrimary
					style={{ width: '100%' }}
					onClick={(ev: any) => {
						doUnstake(`${totalStaked}`, populatedSeed.seed_id);
					}}>
					Unstake
				</ButtonPrimary>
				<p style={{ display: 'none' }}>
					<small>{`Ready to unstake: ${`${totalStaked}`.substring(0, 4)}`}</small>
				</p>
			</div>
		</>
	);
};

const openModalStake = ({
	...props
}: {
	themeProvided: IDarkModeContext;
	total_available_to_staked: number | string;
	populatedSeed: IPopulatedSeed;
	useFluxusFarmContract: boolean;
}) => {
	const { themeProvided, total_available_to_staked, populatedSeed, useFluxusFarmContract } = props;
	themeProvided.modal.setModalProps({
		isActived: true,
		header: <ModalStakeHeader />,
		content: (
			<ModalStakeContent
				totalAvailableToStake={total_available_to_staked}
				populatedSeed={populatedSeed}
				useFluxusFarmContract={useFluxusFarmContract}
			/>
		),
		footer: (
			<ModalStakeFooter
				totalAvailableToStake={total_available_to_staked}
				populatedSeed={populatedSeed}
				useFluxusFarmContract={useFluxusFarmContract}
			/>
		),
	});
};

const ModalStakeHeader = () => (
	<>
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				padding: '0',
			}}>
			<h1 style={{ fontWeight: 'regular', fontSize: '1.1rem', margin: '0', width: '100%', textAlign: 'center' }}>
				Stake Your LP Token`s to farm your rewards.
			</h1>
		</div>
	</>
);
const ModalStakeContent = (props: {
	totalAvailableToStake: number | string;
	populatedSeed: IPopulatedSeed;
	useFluxusFarmContract: boolean;
}) => {
	const themeProvided = useDarkMode();
	const { totalAvailableToStake, populatedSeed, useFluxusFarmContract } = props;
	const [stakeValue, setStakeValue] = useState<string>('');
	const [stakeInputValue, setStakeInputValue] = useState<string>('');

	const formatReadableAmountValue = (unstakeInputValue: number | string, decimals = 24) => {
		const amount: string = toReadableNumber(decimals, toNonDivisibleNumber(decimals, `${unstakeInputValue}`));
		const [wholeNumber, decimalNumber] = amount.split('.');
		const decimalsLength = decimals - (wholeNumber.length - 1);
		const paddedDecimalNumber = (decimalNumber || `0`).padEnd(decimalsLength, `0`);
		return `${wholeNumber}.${paddedDecimalNumber}`;
	};

	const updateModalValues = (totalToStake: number | string) => {
		const amount: string = toReadableNumber(24, toNonDivisibleNumber(24, `${totalToStake || '0'}`));
		themeProvided.modal.setModalProps({
			isActived: true,
			header: themeProvided.modal.modalProps.header,
			content: themeProvided.modal.modalProps.content,
			footer: (
				<ModalStakeFooter
					populatedSeed={populatedSeed}
					totalAvailableToStake={amount}
					useFluxusFarmContract={useFluxusFarmContract}
				/>
			),
		});
	};

	useEffect(() => {
		const DOMLoaded = true;
		let timeToUpdateValue = setTimeout(() => {}, 10);
		(async () => {
			if (DOMLoaded) {
				if (stakeInputValue.length > 0 && stakeInputValue !== stakeValue) {
					const formatedAmount = formatReadableAmountValue(stakeInputValue);
					const amountIsLowerThenTotalAvailableToStake =
						Number(formatedAmount) <= Number(toReadableNumber(24, `${totalAvailableToStake}`));
					const amount = amountIsLowerThenTotalAvailableToStake
						? formatedAmount
						: toReadableNumber(24, `${totalAvailableToStake}`);
					timeToUpdateValue = setTimeout(() => {
						setStakeInputValue(amount);
					}, 2000);
					setStakeValue(amount);
					updateModalValues(amount);
				}
			}
		})();

		return () => {
			clearTimeout(timeToUpdateValue);
		};
	}, [stakeInputValue]);

	useEffect(() => {
		setStakeInputValue(toReadableNumber(24, `${totalAvailableToStake}`));
		return () => {
			setStakeInputValue(toReadableNumber(24, `0`));
		};
	}, []);
	return (
		<>
			<div
				style={{
					position: 'relative',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexDirection: 'row',
					flexWrap: 'nowrap',
					gap: '8px',
					width: '100%',
					minHeight: '190px',
				}}>
				<input
					type="text"
					placeholder="0.00"
					style={{
						flex: '1',
						height: '45px',
						fontSize: '16px',
						borderRadius: '8px',
						backgroundColor: '#111111',
						border: '1px solid #63cdb4',
						boxShadow: `0px 0px 15px rgba(0, 0, 0, 0.02)`,
						padding: `0 60px 0 10px`,
						color: '#FFFFFF',
					}}
					value={stakeInputValue}
					onChange={(ev: ChangeEvent<HTMLInputElement>) => {
						const value = ev.target.value.length > 0 ? ev.target.value : `0`;
						if (value.slice(-1) === '.') {
							setStakeInputValue(value);
							return;
						}
						const matchNumbers = value.match(/\d+/g);
						const amount = matchNumbers ? matchNumbers.splice(0, 2).join('.') : value;
						setStakeInputValue(amount);
					}}
				/>
				<span
					style={{
						border: 'none',
						borderLeft: '1px solid #63cdb4',
						height: '45px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'row',
						flexWrap: 'nowrap',
						width: '60px',
						position: 'absolute',
						right: '1px',
					}}
					onClick={(ev: any) => {
						setStakeInputValue(toReadableNumber(24, `${totalAvailableToStake}`));
					}}>
					MAX
				</span>
			</div>
		</>
	);
};
const ModalStakeFooter = (props: {
	totalAvailableToStake: number | string;
	populatedSeed: IPopulatedSeed;
	useFluxusFarmContract: boolean;
}) => {
	const { totalAvailableToStake, populatedSeed, useFluxusFarmContract } = props;
	const doStake = async (amount: string, seed_id: string | number): Promise<any> => {
		// const stakeAmount = `${parseFloat(amount) / 3}`;
		// if (typeof setStateRewardsIsLoading === 'function') {
		// 	setStateRewardsIsLoading(true);
		// }
		const windowWalletProvider = await nearWalletAsWindow.getWindowWalletRPC<INearRPCContext>();
		const tokenID = `${seed_id}`.split('@').splice(1, 1).join('');
		const stakeValues = {
			token_id: getMftTokenId(`${tokenID}`),
			amount,
			useFluxusFarmContract,
		};
		await windowWalletProvider
			.getNearPresets()
			.stake_farm_lp_Tokens(stakeValues)
			.catch((error: any) => {
				// Error log
				console.log('Stake error: ', error);
			});
		const walletResponse = await nearWalletAsWindow.getWalletCallback();
		if (!walletResponse.success) {
			window.alert(walletResponse.message);
		}
		return stakeValues;
	};
	return (
		<>
			<div style={{ width: '100%', padding: '0' }}>
				<ButtonPrimary
					style={{ width: '100%' }}
					onClick={(ev: any) => {
						doStake(`${totalAvailableToStake}`, populatedSeed.seed_id);
					}}>
					Stake now
				</ButtonPrimary>
				<p style={{ display: 'none' }}>
					<small>{`Ready to unstake: ${`${totalAvailableToStake}`.substring(0, 4)}`}</small>
				</p>
			</div>
		</>
	);
};
export default CardFarm;
