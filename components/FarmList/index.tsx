/* eslint-disable react/no-array-index-key */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, ReactElement } from 'react';
import Switch from 'react-switch';
import { useNearRPCContext } from '@hooks/index';
import { IFarmData, ISeedInfo, PoolDetails } from '@workers/workerNearPresets';
import { ftGetTokenMetadata, TokenMetadata } from '@services/ft-contract';
import { getSharesInPool } from '@services/pool';
import { getRewardByTokenId, getStakedListByAccountId, getUnclaimedReward } from '@services/farm';
import BoxGhost from '@components/BoxGhost';
import CardFarm from '@components/CardFarm/index';
import { ICardFarmState } from '@components/CardFarm';
import CircularProgress from '@material-ui/core/CircularProgress';
import { checkTransaction } from '@services/swap';
import { toReadableNumber } from '@utils/numbers';
import { getPoolTvlFiatPrice, IPoolFiatPrice } from '@services/api';
import { IPopulatedPoolExtraDataToken, IPopulatedPoolExtraDataVolume } from '@components/VaultList';
import { WrapBox, SwitchArea, SwitchAreaTitle, SwitchAreaTitleTag, ProgressArea } from './styles';

export type IPopulatedPool = PoolDetails & { populated_tokens: Array<TokenMetadata>; shares_lptoken: any };
export type IPopulatedSeed = ISeedInfo & {
	populated_farms: Array<IFarmData>;
	pool_id: string | number;
	pool: IPopulatedPool;
	token_from: TokenMetadata;
	token_to: TokenMetadata;
	user_staked_amount?: number | string | undefined;
};

export type IDefaultFarmItemData = ICardFarmState & { id: string | number };
const FarmList: React.FC = function () {
	const nearRPCContext = useNearRPCContext();
	const nearPresets = nearRPCContext.getNearPresets();
	// Used to keep box height size while rendering the list of farms.
	const [stateFarmsBoxCssStyleProperties, setStateFarmsBoxCssStyleProperties] = useState<React.CSSProperties>({
		minHeight: '300px',
	} as React.CSSProperties);
	// Set if it will use the fluxus farm contract (Setted from UI Switch Button).
	const [useFluxusFarmContractState, setUseFluxusFarmContractState] = useState<boolean>(false);
	// List of seeds to show farms at farm box component
	const [FarmsState, setFarmsState] = useState<Array<IPopulatedSeed>>([] as Array<IPopulatedSeed>);

	const [transactionHashes, setTransactionHashs] = useState<Array<string>>(['']);

	// Used to fixed box height while load and list seeds
	const setFarmBoxMinHeightWithCurrentHeight = async () => {
		try {
			const farmBoxElement = document.querySelectorAll<HTMLDivElement>(
				`div[data-componentname="farmBoxElement"]`,
			);
			if (farmBoxElement.length < 1) {
				throw new Error(`Farm box element not found for query "div[data-componentname="farmBoxElement"]".`);
			}
			const minHEightAsCurrentHeightValue = `${farmBoxElement[0].clientHeight}px`;

			setStateFarmsBoxCssStyleProperties({
				minHeight: minHEightAsCurrentHeightValue,
				position: 'relative',
			} as React.CSSProperties);

			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	};
	// Reset the farm boz min height to be the auto height with yout content height
	const resetFarmBoxMinHeight = () => {
		try {
			const farmBoxElement = document.querySelectorAll<HTMLDivElement>(
				`div[data-componentname="farmBoxElement"]`,
			);
			if (farmBoxElement.length < 1) {
				throw new Error(`Farm box element not found for query "div[data-componentname="farmBoxElement"]".`);
			}
			setStateFarmsBoxCssStyleProperties({
				minHeight: '300px',
			} as React.CSSProperties);
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	};

	const getPopulatedSeeds = async () => {
		// get all user staked LP Tokens
		const userStakedList = await getStakedListByAccountId({ useFluxusFarmContract: useFluxusFarmContractState });
		// Object with key as farm_id and value as farm data
		const farmsObject: Record<any, any> = {};
		// Array of all object farmData
		const Farms = (await nearPresets.get_farms(1, useFluxusFarmContractState)).map((farm, index: number) => {
			farmsObject[farm.farm_id] = farm;
			return farm;
		});
		// Filter for just with pool seed
		const listSeeds = Object.values(await nearPresets.get_list_seeds_info(1, useFluxusFarmContractState)).filter(
			(seed, seedIndex: number) => {
				const poolId = parseInt(seed.seed_id.split('@').splice(1, 1).join(''), 10);
				if (Number.isNaN(poolId) || poolId < 1) {
					return 0;
				}
				return 1;
			},
		);
		// Array of IPopulatedSeed data object
		const populatedSeeds: Array<IPopulatedSeed> = await Promise.all(
			listSeeds.map(async (seed, index: number) => {
				const populateSeed = seed as IPopulatedSeed;
				populateSeed.populated_farms = await Promise.all(
					seed.farms.map(async (farmID: string, index: number) => {
						let farm = {} as IFarmData;
						farm = farmsObject[farmID];
						farm.token_details = await ftGetTokenMetadata(farm.reward_token, false);
						farm.user_reward = await getRewardByTokenId(
							farm.reward_token,
							undefined,
							useFluxusFarmContractState,
						);
						farm.user_unclaimed_reward = await getUnclaimedReward(
							farmID,
							undefined,
							useFluxusFarmContractState,
						);
						farmsObject[farmID] = farm;
						return farm;
					}),
				);
				// Pool ID from Seed ID by split @ at the second position
				const poolID = ((seed_id: string) => {
					const poolIDFromSeedID = seed_id.split('@').splice(1, 1).join('');
					return parseInt(poolIDFromSeedID, 10);
				})(populateSeed.seed_id);
				// set the pool ID "12" at the populated seed object
				populateSeed.pool_id = poolID;
				const poolTvlFiatPrice = await getPoolTvlFiatPrice({ pool_id: poolID });
				const populatedPool = { ...poolTvlFiatPrice } as IPoolFiatPrice &
					IPopulatedPoolExtraDataToken &
					IPopulatedPoolExtraDataVolume;
				populatedPool.populated_tokens = await Promise.all(
					populatedPool.token_account_ids.map(async (token_id: string) =>
						ftGetTokenMetadata(token_id, false),
					),
				);
				populatedPool.shares_lptoken = await getSharesInPool({ pool_id: poolID });
				populateSeed.pool = populatedPool;
				populateSeed.token_from = await ftGetTokenMetadata(populateSeed.pool.token_account_ids[0]);
				populateSeed.token_to = await ftGetTokenMetadata(populateSeed.pool.token_account_ids[1]);
				populateSeed.user_staked_amount =
					typeof userStakedList[populateSeed.seed_id] !== 'undefined'
						? userStakedList[populateSeed.seed_id]
						: undefined;
				return populateSeed;
			}),
		);
		return populatedSeeds;
	};

	const loadFarms = async () => {
		setFarmBoxMinHeightWithCurrentHeight();
		// Array of IPopulatedSeed data object
		const populatedSeeds = await getPopulatedSeeds();

		// All rewards available from farm contract
		setTimeout(() => {
			console.log('Loaded Farms: ', populatedSeeds);
			setFarmsState(populatedSeeds);
			setTimeout(() => {
				resetFarmBoxMinHeight();
			}, 300);
		}, 200);
	};

	const getTrasactionHashs = () => new URLSearchParams(window.location.search).get('transactionHashes')?.split(',');

	// Implementation in progress
	const checkTransactions = async () => {
		const transactions = getTrasactionHashs() || [];
		const transactionsResponse = await Promise.all(
			transactions.map(async (txHash: string) => {
				const { transaction, transaction_outcome } = await checkTransaction(txHash);
				const actionsCount = transaction?.actions?.length || 0;
				const offsetTransaction = actionsCount < 1 ? -1 : actionsCount > 1 ? 1 : 0;
				const methodName =
					offsetTransaction >= 0
						? transaction?.actions[offsetTransaction]?.FunctionCall?.method_name
						: 'action_not_founded';
				const executorId = transaction_outcome?.outcome?.executor_id;
				const gasBurnt = transaction_outcome?.outcome?.gas_burnt || 0;
				const gasBurntReadAble = toReadableNumber(24, `${gasBurnt}`);
				const explorerId = transaction_outcome?.id;
				const explorerLink = `${nearRPCContext.config.explorerUrl}/transactions/${explorerId}`;
				return { methodName, executorId, gasBurnt, gasBurntReadAble, explorerId, explorerLink };
			}),
		);
		console.log(transactionsResponse);
	};

	useEffect(() => {
		const DOMLoaded = true;
		(async () => {
			if (DOMLoaded) {
				loadFarms();
				checkTransactions();
			}
		})();
		return () => {
			setFarmsState([]);
			setTransactionHashs([]);
		};
	}, [useFluxusFarmContractState]);

	return (
		<>
			<WrapBox
				style={{
					marginTop: `85px`,
				}}>
				<SwitchArea style={{ marginBottom: '15px' }}>
					<SwitchArea>
						<SwitchAreaTitle>
							Switch DEX:{' '}
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
				<BoxGhost data-componentname="farmBoxElement" style={stateFarmsBoxCssStyleProperties}>
					{FarmsState.length < 1 && (
						<ProgressArea>
							<CircularProgress color="secondary" />
							<h4>Loading Farms</h4>
						</ProgressArea>
					)}
					{FarmsState.map((item: IPopulatedSeed, index: number) => (
						<CardFarm
							key={item.seed_id}
							populatedSeed={item}
							useFluxusFarmContract={useFluxusFarmContractState}
						/>
					))}
				</BoxGhost>
			</WrapBox>
		</>
	);
};

export default FarmList;
