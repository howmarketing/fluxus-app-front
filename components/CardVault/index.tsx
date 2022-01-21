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
import { IDarkModeContext } from '@contexts/darkMode';
import { useDarkMode, useNearRPCContext } from '@hooks/index';
import { toNonDivisibleNumber, toReadableNumber } from '@utils/numbers';
import { nearWalletAsWindow } from '@utils/nearWalletAsWindow';
import { getMftTokenId } from '@utils/token';
import { IFarmData as IVaultData } from '@workers/workerNearPresets';
import { unstake } from '@services/m-token';
import { getRewardByTokenId, getUnclaimedReward } from '@services/farm';
import { TokenMetadata } from '@services/ft-contract';
import CardRewards, { IPopulatedReward } from '@components/CardRewards';
import { IPopulatedSeed } from '@components/VaultList';
import ButtonPrimary from '@components/ButtonPrimary';
import ButtonGhost from '@components/ButtonGhost';
import uxusIcon from '@assets/app/uxus.svg';
import WhatThisMeanIcon from '@assets/app/what-this-mean-white-icon.svg';
import PolygonIcon from '@assets/app/polygon.svg';
import NearIcon from '@assets/app/nearIcon.svg';
import {
	CardVaultAreaStyled,
	CardContainerStyled,
	CardHeader,
	CardHeaderCoinPairsIcon,
	CardHeaderCoinPairsLabel,
	CardBodyEarnings,
	CardHeaderMultiplier,
	CardHeaderTotalDeposited,
	CardHeaderAPYX,
	CardHeaderDropDown,
	CardBody,
	CardBodyTabs,
	CardBodyTabsContent,
	CardBodyTabsContentItem,
	CardBodyRewardsList,
	CardBodyCompountInfo,
	Separator,
	CardBodyVaultInfo,
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
export type ICardVaultState = {
	populatedSeed: IPopulatedSeed;
	useFluxusVaultContract?: boolean | undefined;
};
export type ICardVaultProps = HTMLAttributes<HTMLDivElement> & ICardVaultState;

export const CardVault = (props: ICardVaultProps): ReactElement => {
	const { populatedSeed, useFluxusVaultContract } = props;
	const [useFluxusVaultContractState, setUseFluxusVaultContractState] = useState<boolean>(false);
	const [cardToggleState, setCardToggleState] = useState<'opened' | 'closed'>('closed');
	const [tabActivedState, setTabActivedState] = useState<number>(0);

	const TabsHeader = (props: { populatedSeed: IPopulatedSeed; activedTabIndex: number }) => {
		const { populatedSeed, activedTabIndex } = props;
		const tabsProps = [
			{ title: 'Overview', isActive: activedTabIndex === 0 },
			{ title: 'Info', isActive: activedTabIndex === 1 },
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
		setUseFluxusVaultContractState(typeof useFluxusVaultContract !== 'undefined' ? useFluxusVaultContract : false);
	}, []);
	return (
		<CardVaultAreaStyled {...props} title={getCardTitle(populatedSeed)} data-componentname="CardVaultAreaStyled">
			<CardHeader data-componentname="CardHeader">
				<CardContainerStyled data-componentname="CardContainerStyled" title="Card Container">
					<DisplayerPoolCoinGroupIcons
						data-componentname="DisplayerPoolCoinGroupIcons"
						populatedSeed={populatedSeed}
					/>
					<DisplayerVaultLabel data-componentname="DisplayerVaultLabel" populatedSeed={populatedSeed} />
					{/* <DisplayerVaultEarnings populatedSeed={populatedSeed} /> */}
					{/* <DisplayerVaultTotalReward populatedSeed={populatedSeed} /> */}
					{/* <DisplayerVaultTotalClaimedReward populatedSeed={populatedSeed} /> */}
					{/* <DisplayerVaultTotalUnClaimedReward populatedSeed={populatedSeed} /> */}
					<DisplayerVaultTotalDeposited populatedSeed={populatedSeed} />
					{/* <DisplayerVaultEarnType populatedSeed={populatedSeed} /> */}
					{/* <DisplayerVaultDropDownButton /> */}
				</CardContainerStyled>
			</CardHeader>
			<CardBody data-kleyname="CardBodyArea" title="Card body area">
				<CardContainerStyled data-componentname="CardContainerStyled" title="Card Container">
					<TabsHeader populatedSeed={populatedSeed} activedTabIndex={tabActivedState} />
					<CardBodyTabsContent data-componentname="CardBodyTabsContent" title="Card body tabs content area">
						<DisplayerCardBodyTabBodyForOverView
							populatedSeed={populatedSeed}
							isActive={tabActivedState === 0}
							useFluxusVaultContract={useFluxusVaultContract || false}
						/>

						<DisplayerCardBodyTabBodyForInfo
							populatedSeed={populatedSeed}
							isActive={tabActivedState === 1}
						/>
					</CardBodyTabsContent>
				</CardContainerStyled>
			</CardBody>
		</CardVaultAreaStyled>
	);
};

export const getCardTitle = (populatedSeed: IPopulatedSeed) => {
	const poolSymbols = populatedSeed.pool.populated_tokens
		.map((tokenData: TokenMetadata, index: number) => `${tokenData.symbol}`)
		.join(' - ');
	return `${poolSymbols}`;
};

export type ICardVaultRewardFooter = {
	populatedSeed: IPopulatedSeed;
	useFluxusVaultContract?: boolean | undefined;
	loadCardRewards?: (updateRewardsValues?: boolean) => Promise<any>;
	setStateRewardsIsLoading?: (value: React.SetStateAction<boolean>) => void;
};
export const CardVaultRewardFooter = ({ ...FooterProps }: ICardVaultRewardFooter) => {
	const themeProvided = useDarkMode();
	const nearRPCContext = useNearRPCContext();
	const { populatedSeed, useFluxusVaultContract, loadCardRewards, setStateRewardsIsLoading } = FooterProps;
	const total_staked = typeof populatedSeed.user_staked_amount !== `undefined` ? populatedSeed.user_staked_amount : 0;
	const total_lptoken =
		typeof populatedSeed.pool.shares_lptoken !== `undefined` ? populatedSeed.pool.shares_lptoken : 0;
	const { seed_id } = populatedSeed;
	const [walletIsSignedState, setWalletIsSignedState] = useState<boolean>(false);

	const claimAllVaultedRewardTokens = async (seed_id: string) => {
		try {
			if (typeof setStateRewardsIsLoading === 'function') {
				setStateRewardsIsLoading(true);
			}
			const windowWalletProvider = await nearWalletAsWindow.getWindowWalletRPC();
			const claimed = await windowWalletProvider
				.getNearPresets()
				.claime_user_rewards_by_seed(seed_id, useFluxusVaultContract)
				.catch((err: any) => {
					console.log('claimAllVaultedRewardTokens:(error) ', err?.message || 'unknown error');
				});
			console.log(`Successfully Claimed rewards for the seed id ${seed_id} `, claimed);
			const walletResponse = await nearWalletAsWindow.getWalletCallback(30000);
			console.log('walletResponse: ', walletResponse);
			if (!walletResponse.success) {
				console.log(walletResponse);
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
					padding: '12px',
					boxShadow: `2px 1000px 1px #101010 inset`,
					opacity: `${!total_staked ? '0.4' : '1'}`,
				}}
				onClick={ev => {
					openModalUnstake({
						themeProvided,
						total_staked,
						populatedSeed,
						useFluxusVaultContract: useFluxusVaultContract || false,
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
					padding: '12px',
					boxShadow: `2px 1000px 1px #101010 inset`,
					opacity: `${`${total_lptoken}`.length < 1 || `${total_lptoken}` === '0' ? '0.4' : '1'}`,
				}}
				onClick={ev => {
					if (`${total_lptoken}`.length > 0 && `${total_lptoken}` !== '0') {
						openModalStake({
							themeProvided,
							populatedSeed,
							total_available_to_staked: total_lptoken,
							useFluxusVaultContract: useFluxusVaultContract || false,
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
					padding: '12px',
					justifyContent: 'center',
					alignItems: 'center',
					flex: '1',
					opacity: `${!total_staked ? '0.4' : '1'}`,
				}}
				onClick={() => {
					if (total_staked) {
						claimAllVaultedRewardTokens(seed_id);
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
				padding: '12px',
			}}
			onClick={() => {
				nearRPCContext.getWallet().requestSignIn();
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
			data-componentname="CardHeaderPoolCoinGroupIcons"
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

export const DisplayerVaultLabel = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	return (
		<CardHeaderCoinPairsLabel data-componentname="CardHeaderCoinPairsLabel" title="Card Header coin pairs - label">
			<h3>
				{getCardTitle(populatedSeed)}
				<small
					style={{
						fontSize: '9px',
						fontStyle: 'italic',
						position: 'static',
						marginLeft: '4px',
						marginTop: '-5px',
					}}>
					{`${populatedSeed.seed_id}`.split('@').splice(1, 1).join('')}
				</small>
			</h3>
		</CardHeaderCoinPairsLabel>
	);
};

export const DisplayerVaultTotalReward = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	const totalVaultsReward = ((totalReward = 0) => {
		populatedSeed.populated_farms.map((PopulatedVault: IVaultData, indexVault: number) => {
			totalReward += Math.abs(
				parseFloat(
					toReadableNumber(
						parseInt(`${PopulatedVault.token_details.decimals}`, 10),
						`${PopulatedVault.total_reward}`,
					),
				),
			);
			return PopulatedVault.total_reward;
		});
		return totalReward;
	})();
	return (
		<CardBodyEarnings data-componentname="CardBodyEarnings" title="Card Header Total Vault Rewards">
			<label htmlFor="Total Vault Rewards">TFRw</label>
			<span>$ {formatMoneyWithShortName(formatMoney(totalVaultsReward))}</span>
		</CardBodyEarnings>
	);
};

export const DisplayerVaultTotalClaimedReward = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	const totalVaultClaimedReward = ((totalClaimedReward = 0) => {
		populatedSeed.populated_farms.map((PopulatedVault, indexVault: number) => {
			totalClaimedReward += Math.abs(
				parseFloat(
					toReadableNumber(
						parseInt(`${PopulatedVault.token_details.decimals}`, 10),
						`${PopulatedVault.claimed_reward}`,
					),
				),
			);
			return PopulatedVault.claimed_reward;
		});
		return totalClaimedReward;
	})();
	return (
		<CardBodyEarnings data-componentname="CardBodyEarnings" title="Card Header Total Vault Claimed Rewards">
			<label htmlFor="Total Vault Claimed Rewards">TFCRw</label>
			<span>$ {formatMoneyWithShortName(formatMoney(totalVaultClaimedReward))}</span>
		</CardBodyEarnings>
	);
};

export const DisplayerVaultTotalUnClaimedReward = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	const totalVaultUnclaimedReward = ((totalUnclaimedReward = 0) => {
		populatedSeed.populated_farms.map((PopulatedVault, indexVault: number) => {
			totalUnclaimedReward += Math.abs(
				parseFloat(
					toReadableNumber(
						parseInt(`${PopulatedVault.token_details.decimals}`, 10),
						`${PopulatedVault.unclaimed_reward}`,
					),
				),
			);
			return PopulatedVault.unclaimed_reward;
		});
		return totalUnclaimedReward;
	})();
	return (
		<CardBodyEarnings data-componentname="CardBodyEarnings" title="Card Header Total Vault Unclaimed Rewards">
			<label htmlFor="Total Vault Unclaimed Rewards">TFUcRw</label>
			<span>$ {formatMoneyWithShortName(formatMoney(totalVaultUnclaimedReward))}</span>
		</CardBodyEarnings>
	);
};

export const DisplayerVaultTotalDeposited = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	const tvl = toReadableNumber(`${populatedSeed.min_deposit}`.length, populatedSeed.amount);
	const tvlNumber = Number(tvl);
	return (
		<CardHeaderTotalDeposited data-componentname="CardHeaderTotalDeposited" title="Card Header Total value locked">
			<span>$ {formatMoneyWithShortName(formatMoney(tvlNumber))}</span>
			<label htmlFor="Deposited">Deposited</label>
		</CardHeaderTotalDeposited>
	);
};

export const DisplayerVaultEarnType = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	return (
		<CardHeaderAPYX data-componentname="CardHeaderAPYX" title="Card Header earn model">
			<label htmlFor="APx type monetization">APR</label>
			<span>7.9%</span>
		</CardHeaderAPYX>
	);
};

export const DisplayerVaultDropDownButton = () => (
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
		<CardBodyTabs data-componentname="CardBodyTabs" title="Card body tabs area">
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

export const DisplayerCardBodyTabBodyForOverView = (props: {
	populatedSeed: IPopulatedSeed;
	isActive: boolean;
	useFluxusVaultContract: boolean;
}) => {
	const { populatedSeed, isActive, useFluxusVaultContract } = props;
	return (
		<CardBodyTabsContentItem data-component="CardBodyTabsContentItem" className={isActive ? 'active' : ''}>
			<DisplayerVaultEarnings data-component="DisplayerVaultEarnings" populatedSeed={populatedSeed} />
			<DisplayerCardBodyRewards
				data-component="DisplayerCardBodyRewards"
				populatedSeed={populatedSeed}
				useFluxusVaultContractState={useFluxusVaultContract}
			/>
			<DisplayerCardBodyCompountInfo
				data-component="DisplayerCardBodyCompountInfo"
				populatedSeed={populatedSeed}
				useFluxusVaultContractState={useFluxusVaultContract}
			/>
			<DisplaySeparator />
			<DisplayCardBodyVaultInfo
				data-component="DisplayCardBodyVaultInfo"
				populatedSeed={populatedSeed}
				useFluxusVaultContractState={useFluxusVaultContract}
			/>
			<ButtonPrimary
				style={{
					width: '100%',
					margin: '30px 0 10px 0',
					height: '50px',
				}}>
				Connect Wallet
			</ButtonPrimary>
		</CardBodyTabsContentItem>
	);
};

export const DisplaySeparator = () => {
	return (
		<Separator data-component="separator">
			<span />
		</Separator>
	);
};

export const DisplayerVaultEarnings = (props: { populatedSeed: IPopulatedSeed }) => {
	const { populatedSeed } = props;
	return (
		<CardBodyEarnings data-type="ghost" data-componentname="CardBodyEarnings" title="Card Body Earnings">
			<label htmlFor="Earnings">Earnings</label>
			<div data-type="drop-earnings">
				{`$${formatMoneyWithShortName(formatMoney(87945.64))}`}
				<img
					className="coinIcon"
					src={NearIcon}
					width="24px"
					height="24px"
					alt="Earnings in near"
					title="Earnings in near"
				/>
			</div>
		</CardBodyEarnings>
	);
};

export const DisplayerCardBodyRewards = (props: {
	populatedSeed: IPopulatedSeed;
	useFluxusVaultContractState: boolean;
}) => {
	const nearRPCContext = useNearRPCContext();
	const { populatedSeed, useFluxusVaultContractState } = props;
	const [stateRewardsIsLoading, setStateRewardsIsLoading] = useState<boolean>(true);
	const [rewardsStateList, setRewardsStateList] = useState<Array<IPopulatedReward>>([] as IPopulatedReward[]);

	const getCardRewardTitle = () => {
		const title = nearRPCContext.getWallet().isSignedIn() ? `Your Rewards` : `Vault not staked`;
		return `${title} | ${getCardTitle(populatedSeed)}`;
	};

	const updateVaultDataRewardValue = async (farmData: IVaultData) => {
		farmData.user_reward = await getRewardByTokenId(
			farmData.token_details.id,
			undefined,
			useFluxusVaultContractState,
		);
		farmData.user_unclaimed_reward = await getUnclaimedReward(
			farmData.farm_id,
			undefined,
			useFluxusVaultContractState,
		);
		return farmData;
	};

	const formatVaultDataAsPopulatedReward = async (
		farmData: IVaultData,
		updateRewardValues: boolean = false,
	): Promise<IPopulatedReward> => {
		farmData = updateRewardValues ? await updateVaultDataRewardValue(farmData) : farmData;
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
				populatedSeed.populated_farms.map(async (farm: IVaultData) =>
					formatVaultDataAsPopulatedReward(farm, updateRewardsValues),
				),
			);
			console.log(rewardsList);
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
	}, []);

	return (
		<CardBodyRewardsList data-componentname="CardBodyRewardsList">
			<div data-type="label">
				Reward Tokens{' '}
				<img data-type="icon" src={WhatThisMeanIcon} width="16px" height="16px" alt="Earnings in near" />
			</div>
			<div data-type="rewardsList">
				<span>{`$${formatMoneyWithShortName(formatMoney(87983.64))}`}</span>
				{rewardsStateList.map((reward, index: number) => {
					return (
						<img
							className="coinIcon"
							src={reward.reward_token_metadata.icon}
							width="28px"
							height="28px"
							alt={`Earnings for ${reward.reward_token_metadata.symbol}`}
						/>
					);
				})}
			</div>
		</CardBodyRewardsList>
	);
};

export const DisplayerCardBodyCompountInfo = (props: {
	populatedSeed: IPopulatedSeed;
	useFluxusVaultContractState: boolean;
}) => {
	const nearRPCContext = useNearRPCContext();
	const { populatedSeed, useFluxusVaultContractState } = props;

	return (
		<CardBodyCompountInfo data-componentname="CardBodyCompountInfo">
			<div data-type="coumpound-item" style={{ flex: '7' }}>
				Auto-compound
			</div>
			<div data-type="coumpound-item" style={{ flex: '3' }}>
				<label>per week</label>
				<span>224</span>
			</div>
			<div data-type="coumpound-item" style={{ flex: '2' }}>
				<label>per day</label>
				<span>32</span>
			</div>
		</CardBodyCompountInfo>
	);
};

export const DisplayCardBodyVaultInfo = (props: {
	populatedSeed: IPopulatedSeed;
	useFluxusVaultContractState: boolean;
}) => {
	const nearRPCContext = useNearRPCContext();
	const { populatedSeed, useFluxusVaultContractState } = props;

	return (
		<CardBodyVaultInfo data-componentname="CardBodyVaultInfo">
			<div data-type="vault-item">
				<label>APY</label>
				<span>126 %</span>
			</div>
			<div data-type="vault-item">
				<label>Daily</label>
				<span>0.18%</span>
			</div>
			<div data-type="vault-item">
				<label>TVL</label>
				<span>{`$${formatMoneyWithShortName(formatMoney(2798000003.64))}`}</span>
			</div>
		</CardBodyVaultInfo>
	);
};

export const DisplayerCardBodyTabBodyForInfo = (props: { populatedSeed: IPopulatedSeed; isActive: boolean }) => {
	const { populatedSeed, isActive } = props;
	return (
		<>
			<CardBodyTabsContentItem data-componentname="CardBodyTabsContentItem" className={isActive ? 'active' : ''}>
				<h1>ABOUT</h1>
				<p>
					Deposit {getCardTitle(populatedSeed)} LP Token into Fluxus Vault to start to earn reward tokens
					including UXU.
				</p>
				<p>The deposit and staking all will happen in just one transaction.</p>
				<p>
					Earn shares of{' '}
					{((Vaults: Array<IVaultData>) =>
						Vaults.map((Vault: IVaultData) => (
							<span key={`${Vault.farm_id}-${Vault.token_details.id}`}>
								{Vault.token_details.symbol}
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
						<a href="#rewards">Vault Rewards</a>
						<ul>
							{populatedSeed.populated_farms.map((Vault: IVaultData, index: number) => (
								<li
									key={`${Vault.farm_id}-${index}`}
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										flexDirection: 'row',
									}}>
									<img
										src={Vault.token_details.icon}
										alt={`Token ${Vault.token_details.symbol} - icon`}
										title={`Token ${Vault.token_details.symbol} - icon`}
										width={28}
									/>
									&nbsp;
									{` ${Vault.token_details.symbol}`}
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

const openModalUnstake = ({
	...props
}: {
	themeProvided: IDarkModeContext;
	total_staked: number | string;
	populatedSeed: IPopulatedSeed;
	useFluxusVaultContract: boolean;
}) => {
	const { themeProvided, total_staked, populatedSeed, useFluxusVaultContract } = props;
	themeProvided.modal.setModalProps({
		isActived: true,
		header: <ModalUnstakeHeader />,
		content: (
			<ModalUnstakeContent
				totalStaked={total_staked}
				populatedSeed={populatedSeed}
				useFluxusVaultContract={useFluxusVaultContract}
			/>
		),
		footer: (
			<ModalUnstakeFooter
				totalStaked={total_staked}
				populatedSeed={populatedSeed}
				useFluxusVaultContract={useFluxusVaultContract}
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
			<h1 style={{ fontWeight: 'regular', fontSize: '1.1rem', margin: '0' }}>Unstake Your Rewards</h1>
		</div>
	</>
);
const ModalUnstakeContent = (props: {
	totalStaked: number | string;
	populatedSeed: IPopulatedSeed;
	useFluxusVaultContract: boolean;
}) => {
	const themeProvided = useDarkMode();
	const { totalStaked, populatedSeed, useFluxusVaultContract } = props;
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
					useFluxusVaultContract={useFluxusVaultContract}
				/>
			),
		});
	};

	useEffect(() => {
		let timeToUpdateValue = setTimeout(() => {}, 10);
		if (unstakeInputValue.length > 0 && unstakeInputValue !== unstakeValue) {
			const formatedAmount = formatReadableAmountValue(unstakeInputValue);
			const amountIsLowerThenTotalInStake =
				Number(formatedAmount) <= Number(toReadableNumber(24, `${totalStaked}`));
			const amount = amountIsLowerThenTotalInStake ? formatedAmount : toReadableNumber(24, `${totalStaked}`);
			timeToUpdateValue = setTimeout(() => {
				setUnstakeInputValue(amount);
			}, 2000);
			setUnstakeValue(amount);
			updateModalValues(amount);
		}
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
					minHeight: '260px',
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
						padding: `0 10px`,
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
						right: '15px',
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
	useFluxusVaultContract: boolean;
}) => {
	const { totalStaked, populatedSeed, useFluxusVaultContract } = props;
	const doUnstake = async (amount: string, seed_id: string | number): Promise<any> => {
		const unstakeValues = {
			seed_id: `${seed_id}`,
			amount,
			useFluxusVaultContract,
		};
		await unstake(unstakeValues).catch((error: any) => {
			console.log('Stake error: ', error);
		});
		return unstakeValues;
	};
	return (
		<>
			<div style={{ width: '100%', padding: '10px 15px' }}>
				<ButtonGhost
					style={{ width: '100%' }}
					onClick={(ev: any) => {
						doUnstake(`${totalStaked}`, populatedSeed.seed_id);
					}}>
					Unstake
				</ButtonGhost>
				<p>
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
	useFluxusVaultContract: boolean;
}) => {
	const { themeProvided, total_available_to_staked, populatedSeed, useFluxusVaultContract } = props;
	themeProvided.modal.setModalProps({
		isActived: true,
		header: <ModalStakeHeader />,
		content: (
			<ModalStakeContent
				totalAvailableToStake={total_available_to_staked}
				populatedSeed={populatedSeed}
				useFluxusVaultContract={useFluxusVaultContract}
			/>
		),
		footer: (
			<ModalStakeFooter
				totalAvailableToStake={total_available_to_staked}
				populatedSeed={populatedSeed}
				useFluxusVaultContract={useFluxusVaultContract}
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
				padding: '25px 15px',
			}}>
			<h1 style={{ fontWeight: 'regular', fontSize: '1.1rem', width: '100%', textAlign: 'center' }}>
				Stake Your LP Token`s to farm your rewards.
			</h1>
		</div>
	</>
);
const ModalStakeContent = (props: {
	totalAvailableToStake: number | string;
	populatedSeed: IPopulatedSeed;
	useFluxusVaultContract: boolean;
}) => {
	const themeProvided = useDarkMode();
	const { totalAvailableToStake, populatedSeed, useFluxusVaultContract } = props;
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
		console.log('updateStakeModalValues amount: ', { totalToStake, amount });
		themeProvided.modal.setModalProps({
			isActived: true,
			header: themeProvided.modal.modalProps.header,
			content: themeProvided.modal.modalProps.content,
			footer: (
				<ModalStakeFooter
					populatedSeed={populatedSeed}
					totalAvailableToStake={amount}
					useFluxusVaultContract={useFluxusVaultContract}
				/>
			),
		});
	};

	useEffect(() => {
		let timeToUpdateValue = setTimeout(() => {}, 10);
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
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexDirection: 'row',
					flexWrap: 'nowrap',
					gap: '8px',
					width: '100%',
					minHeight: '200px',
					padding: '10px 15px',
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
						padding: `0 10px`,
						color: '#FFFFFF',
					}}
					value={stakeInputValue}
					onChange={(ev: ChangeEvent<HTMLInputElement>) => {
						console.log('event: ', ev);
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
						border: '1px solid #63cdb4',
						borderRadius: '6px',
						padding: '5px 10px',
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
	useFluxusVaultContract: boolean;
}) => {
	const { totalAvailableToStake, populatedSeed, useFluxusVaultContract } = props;
	const doStake = async (amount: string, seed_id: string | number): Promise<any> => {
		// const stakeAmount = `${parseFloat(amount) / 3}`;
		// if (typeof setStateRewardsIsLoading === 'function') {
		// 	setStateRewardsIsLoading(true);
		// }
		const windowWalletProvider = await nearWalletAsWindow.getWindowWalletRPC();
		const tokenID = `${seed_id}`.split('@').splice(1, 1).join('');
		const stakeValues = {
			token_id: getMftTokenId(`${tokenID}`),
			amount,
			useFluxusVaultContract,
		};
		const staked = await windowWalletProvider
			.getNearPresets()
			.stake_farm_lp_Tokens(stakeValues)
			.catch((error: any) => {
				console.log('Stake error: ', error);
			});
		const walletResponse = await nearWalletAsWindow.getWalletCallback();
		console.log('walletResponse: ', walletResponse);
		if (!walletResponse.success) {
			console.log(walletResponse);
			window.alert(walletResponse.message);
		}
		console.log('staked: ', amount);
		return stakeValues;
	};
	return (
		<>
			<div style={{ width: '100%', padding: '10px 15px' }}>
				<ButtonGhost
					style={{ width: '100%' }}
					onClick={(ev: any) => {
						doStake(`${totalAvailableToStake}`, populatedSeed.seed_id);
					}}>
					Stake now
				</ButtonGhost>
				<p>
					<small>{`Ready to unstake: ${`${totalAvailableToStake}`.substring(0, 4)}`}</small>
				</p>
			</div>
		</>
	);
};

export default CardVault;
