/* eslint-disable no-alert */
import React, { useEffect, useState, ButtonHTMLAttributes } from 'react';
import Switch from 'react-switch';
import { useNearRPCContext } from '@hooks/index';
import { toReadableNumber } from '@utils/numbers';
import { IUserListRewards } from '@workers/workerNearPresets';
import { ftGetTokenMetadata, TokenMetadata } from '@services/ft-contract';
import { nearWalletAsWindow } from '@utils/nearWalletAsWindow';
import ButtonPrimary from '@components/ButtonPrimary';
import { IPopulatedReward } from '@components/CardRewards';
import { REF_FARM_CONTRACT_ID } from '@services/near';
import { INearRPCContext } from '@contexts/nearData/nearRPCData';
import { CardURewardsStyle, SwitchArea, SwitchAreaTitle, SwitchAreaTitleTag, WrapCenterView } from './style';

export type IUserDeposit = { amount: number | string } & TokenMetadata;
export type IUserListDeposits = Array<IUserDeposit>;
export type CardUserRewardsProps = Record<string, any>;
export const CardUserRewards: React.FC<CardUserRewardsProps> = function ({ ...props }) {
	const nearRPCContext = useNearRPCContext();

	// Set if it will use the fluxus farm contract (Setted from UI Switch Button).
	const [useFluxusFarmContractState, setUseFluxusFarmContractState] = useState<boolean>(false);

	// State of user rewards list to display and be able to withdraw they tokens
	const [userRewardTokensState, setUserRewardTokensState] = useState<Array<IPopulatedReward>>(
		[] as Array<IPopulatedReward>,
	);

	const [checkedRewardsToWithdrawState, setCheckedRewardsToWithdrawState] = useState<ICheckedRewardsToWithDraw>(
		[] as ICheckedRewardsToWithDraw,
	);

	const onSelectRewardToWithdraw = (
		rewardData: IPopulatedReward & { reward_index: number; is_selected: boolean },
	) => {
		const rewardFormatedProps = {
			reward_id: rewardData.reward_token_id,
			reward_index: rewardData.reward_index,
			reward_decimals: rewardData.reward_token_metadata.decimals,
			reward_amount: `${rewardData?.total_reward_default || 0}`,
			is_selected: rewardData.is_selected,
		};
		const { reward_id, reward_index, reward_decimals, reward_amount, is_selected } = rewardFormatedProps;
		const withdrawList = checkedRewardsToWithdrawState
			.filter((rewardToken, offset: number) => {
				const [rewardID] = Object.keys(rewardToken);
				const rewardAlreadySetted = rewardID === reward_id;
				return rewardAlreadySetted ? 0 : 1;
			})
			.filter((rewardToken, offset: number) => {
				const [rewardID] = Object.keys(rewardToken);
				const isSelected = !is_selected && rewardID === reward_id;
				return isSelected ? 0 : 1;
			})
			.map(reward => reward);

		if (is_selected) {
			const newRewardToWithdrawList: IWithdrawReward = {
				[`${reward_id}`]: { index: reward_index, decimals: reward_decimals, value: reward_amount },
			};
			withdrawList.push(newRewardToWithdrawList);
		}
		setCheckedRewardsToWithdrawState(withdrawList);
	};

	// Will be deleted after finish some laboratorial tests
	const getUserListDeposits = async (): Promise<IUserListDeposits> => {
		if (!nearRPCContext.getWallet().isSignedIn()) {
			return [] as IUserListDeposits;
		}
		const deposits = await nearRPCContext.getNearPresets().get_user_list_deposits();
		const depositAmounts = Object.values(deposits);
		const depositsPopulated = await Promise.all(
			Object.keys(deposits).map(async (tokenId: string, index: number) => {
				const tokenMetaData = await ftGetTokenMetadata(tokenId);
				return {
					amount: depositAmounts[index],
					...tokenMetaData,
				} as IUserDeposit;
			}),
		);
		return depositsPopulated;
	};

	const formatListOfTokenAndValueToRewardList = async (
		tokenAndValueList: IUserListRewards,
	): Promise<Array<IPopulatedReward>> => {
		if (!nearRPCContext.getWallet().isSignedIn()) {
			return [];
		}
		const rewardsEntries = Object.entries(tokenAndValueList);
		const rewardsFormated: Array<IPopulatedReward> = await Promise.all(
			rewardsEntries.map(async (userRewardData: Array<string>): Promise<IPopulatedReward> => {
				const [userRewardTokenId, userRewardValue] = userRewardData;
				const tokenMetaData = await ftGetTokenMetadata(userRewardTokenId);
				const rewardName = `${tokenMetaData.name}`
					.trim()
					.split(' ')
					.slice(0, 1)
					.join('')
					.split('.')
					.slice(0, 1)
					.join('');

				return {
					reward_token_id: userRewardTokenId,
					total_reward: toReadableNumber(tokenMetaData.decimals, `${userRewardValue}`),
					total_reward_default: userRewardValue,
					reward_token_name: `${`${rewardName}`.substring(0, 6)}${rewardName.length > 11 ? '...' : ''}`,
					reward_token_metadata: tokenMetaData,
				};
			}),
		);
		return rewardsFormated;
	};

	const defineUserRewardListToState = async () => {
		setCheckedRewardsToWithdrawState([] as ICheckedRewardsToWithDraw);
		const userRewards = await nearRPCContext
			.getNearPresets()
			.get_user_list_rewards(undefined, useFluxusFarmContractState);
		const fomartedRewards = await formatListOfTokenAndValueToRewardList(userRewards);
		setUserRewardTokensState(fomartedRewards);
	};

	useEffect(() => {
		if (nearRPCContext.getWallet().isSignedIn()) {
			defineUserRewardListToState();
		}
	}, [useFluxusFarmContractState]);

	return (
		<>
			<WrapCenterView>
				<SwitchArea>
					<SwitchArea>
						<SwitchAreaTitle>
							Switch DEX rewards view:{' '}
							<span className={!useFluxusFarmContractState ? 'selected' : ''}>Ref-finance</span>
							{` / `}
							<span className={useFluxusFarmContractState ? 'selected' : ''}>Fluxus</span>.
						</SwitchAreaTitle>
					</SwitchArea>
					<SwitchArea>
						<SwitchAreaTitleTag>{useFluxusFarmContractState ? `Fluxus` : `Ref`}</SwitchAreaTitleTag>
						<Switch
							checked={useFluxusFarmContractState}
							onChange={(event: any) => {
								setUseFluxusFarmContractState(!useFluxusFarmContractState);
							}}
							onColor="#86d3ff"
							onHandleColor="#2693e6"
							handleDiameter={22}
							uncheckedIcon={false}
							checkedIcon={false}
							boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
							activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
							height={16}
							width={35}
							className="react-switch"
							id="material-switch"
						/>
					</SwitchArea>
				</SwitchArea>
			</WrapCenterView>
			<CardURewardsStyle
				title={`User ${
					nearRPCContext.getWallet().isSignedIn() ? nearRPCContext.getWallet().getAccountId() : ' '
				} Reward Tokens`}
				selectedRewardFunction={onSelectRewardToWithdraw}
				rewards={userRewardTokensState}
				cardFooter={
					<CardURewardsFooter
						checkedRewards={checkedRewardsToWithdrawState}
						useFluxusFarmContractState={useFluxusFarmContractState}
						defineUserRewardListToState={defineUserRewardListToState}
					/>
				}
			/>
		</>
	);
};

export type IWithdrawReward = Record<string, { index: number; decimals: number; value: string }>;
export type ICheckedRewardsToWithDraw = Array<IWithdrawReward>;

export const CardURewardsFooter = ({
	checkedRewards = [] as ICheckedRewardsToWithDraw,
	useFluxusFarmContractState = false,
	defineUserRewardListToState,
}: {
	checkedRewards: ICheckedRewardsToWithDraw;
	useFluxusFarmContractState: boolean;
	defineUserRewardListToState: () => Promise<any>;
}) => {
	const nearRPCContext = useNearRPCContext();
	const [walletIsSignedState, setWalletIsSignedState] = useState<boolean>(false);
	const [withdrawLoadingState, setWithdrawLoadingState] = useState<boolean>(true);
	const walletWindow = nearWalletAsWindow;

	const requestWalletConnection = async () => {
		try {
			const windowWalletProvider = await nearWalletAsWindow.getWindowWalletRPC<INearRPCContext>();
			await windowWalletProvider.getWallet().requestSignIn(nearRPCContext.config.FLUXUS_VAULT_CONTRACT_ID);
			const walletResponse = await nearWalletAsWindow.getWalletCallback();
			if (!walletResponse.success) {
				alert(walletResponse.message);
				return;
			}
			try {
				setTimeout(() => {
					window.location.href = `${window.location.href}?loggedin=true`;
				}, 1500);
			} catch (e: any) {
				// Error log
				console.log(`Refresh window error.`, e);
			}
		} catch (e: any) {
			window.alert(`${e?.message || 'Unknown wallet sign request error.'}`);
		}
	};

	const doWithDraw = async () => {
		setWithdrawLoadingState(true);
		const checkedRewardList: IWithdrawReward = {} as IWithdrawReward;
		const windowWalletProvider = await walletWindow.getWindowWalletRPC<INearRPCContext>();
		try {
			try {
				checkedRewards.forEach((reward, offset: number) => {
					const [rewardID] = Object.keys(reward);
					const [rewardData] = Object.values(reward);
					checkedRewardList[`${rewardID}`] = {
						index: rewardData.index,
						decimals: rewardData.decimals,
						value: rewardData.value,
					};
				});
			} catch (e: any) {
				console.error(e);
				throw new Error(`${e?.message || 'Unknown'}`);
			}

			try {
				await windowWalletProvider
					.getNearPresets()
					.withdraw_user_rewards(checkedRewardList, false, useFluxusFarmContractState);
			} catch (e: any) {
				console.error(e);
				throw new Error(`${e?.message || 'Unknown'}`);
			}
			try {
				const walletWindowCallback = await walletWindow.getWalletCallback();
				if (!walletWindowCallback.success) {
					alert(walletWindowCallback.message);
				}
			} catch (e: any) {
				console.error(e);
				throw new Error(`${e?.message || 'Unknown'}`);
			}

			await defineUserRewardListToState();
			setWithdrawLoadingState(false);
		} catch (e: any) {
			console.error(e);
			window.alert(`Error: ${e?.message || 'unknow error while try to use near wallet RPC Provider.'}`);
		}
	};

	const ButtonWithdrawRewards = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
		<>
			{walletIsSignedState && (
				<ButtonPrimary
					type="button"
					disabled={withdrawLoadingState}
					style={{
						minWidth: '100%',
					}}
					onClick={(ev: React.MouseEvent) => {
						(async () => {
							doWithDraw();
						})();
					}}>
					Withdraw your rewards
				</ButtonPrimary>
			)}
		</>
	);
	// Button component to trigger the connect wallet function from the near RPC connection interface
	const ConnectWalletButton = () => (
		<>
			<ButtonPrimary
				style={{
					display: walletIsSignedState ? 'none' : 'block',
					width: 'auto',
					minWidth: '100%',
				}}
				onClick={(ev: any) => {
					requestWalletConnection();
				}}>
				Connect wallet
			</ButtonPrimary>
		</>
	);

	useEffect(() => {
		const DOMLoaded: boolean = true;
		(async () => {
			if (!DOMLoaded) {
				return;
			}
			setWalletIsSignedState(nearRPCContext.getWallet().isSignedIn());
			await new Promise(resolve => {
				setTimeout(() => {
					resolve(true);
				}, 1500);
			});
			setWithdrawLoadingState(false);
		})();
		return () => {
			setWalletIsSignedState(false);
			setWithdrawLoadingState(true);
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
				flexWrap: 'nowrap',
			}}>
			<ButtonWithdrawRewards />
			<ConnectWalletButton />
		</div>
	);
};

export default CardUserRewards;
