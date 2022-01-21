/* eslint-disable react/no-array-index-key */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, ReactElement } from 'react';
import Switch from 'react-switch';
import { useNearRPCContext } from '@hooks/index';
import { IFarmData as IVaultData, ISeedInfo, PoolDetails } from '@workers/workerNearPresets';
import { ftGetTokenMetadata, TokenMetadata } from '@services/ft-contract';
import { getSharesInPool } from '@services/pool';
import { getRewardByTokenId, getStakedListByAccountId, getUnclaimedReward } from '@services/farm';
import CardVault from '@components/CardVault/index';
import { ICardVaultState } from '@components/CardVault';
import { WrapBox, SwitchArea, SwitchAreaTitle, SwitchAreaTitleTag, ListVaultsBox } from './styles';

export type IPopulatedPool = PoolDetails & { populated_tokens: Array<TokenMetadata>; shares_lptoken: any };
export type IPopulatedSeed = ISeedInfo & {
	populated_farms: Array<IVaultData>;
	pool_id: string | number;
	pool: IPopulatedPool;
	token_from: TokenMetadata;
	token_to: TokenMetadata;
	user_staked_amount?: number | string | undefined;
};

export type IDefaultVaultItemData = ICardVaultState & { id: string | number };
const VaultList: React.FC = function () {
	const nearRPCContext = useNearRPCContext();
	const nearPresets = nearRPCContext.getNearPresets();
	// Used to keep box height size while rendering the list of farms.
	const [stateVaultsBoxCssStyleProperties, setStateVaultsBoxCssStyleProperties] = useState<React.CSSProperties>({
		minHeight: '300px',
	} as React.CSSProperties);
	// Set if it will use the fluxus farm contract (Setted from UI Switch Button).
	const [useFluxusVaultContractState, setUseFluxusVaultContractState] = useState<boolean>(false);
	// List of seeds to show farms at farm box component
	const [VaultsState, setVaultsState] = useState<Array<IPopulatedSeed>>([] as Array<IPopulatedSeed>);

	// Used to fixed box height while load and list seeds
	const setVaultBoxMinHeightWithCurrentHeight = async () => {
		try {
			const valtBoxElement = document.querySelectorAll<HTMLDivElement>(
				`div[data-componentname="valtBoxElement"]`,
			);
			if (valtBoxElement.length < 1) {
				throw new Error(`Vault box element not found for query "div[data-componentname="valtBoxElement"]".`);
			}
			const minHEightAsCurrentHeightValue = `${valtBoxElement[0].clientHeight}px`;

			setStateVaultsBoxCssStyleProperties({
				minHeight: minHEightAsCurrentHeightValue,
			} as React.CSSProperties);

			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	};
	// Reset the farm boz min height to be the auto height with yout content height
	const resetVaultBoxMinHeight = () => {
		try {
			const valtBoxElement = document.querySelectorAll<HTMLDivElement>(
				`div[data-componentname="valtBoxElement"]`,
			);
			if (valtBoxElement.length < 1) {
				throw new Error(`Vault box element not found for query "div[data-componentname="valtBoxElement"]".`);
			}
			setStateVaultsBoxCssStyleProperties({
				minHeight: '300px',
			} as React.CSSProperties);
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	};

	const loadVaults = async () => {
		setVaultBoxMinHeightWithCurrentHeight();
		// get all user staked LP Tokens
		const userStakedList = await getStakedListByAccountId({ useFluxusFarmContract: useFluxusVaultContractState });
		// Object with key as farm_id and value as farm data
		const farmsObject: Record<any, any> = {};
		// Array of all object farmData
		const Vaults = (await nearPresets.get_farms(1, useFluxusVaultContractState)).map((farm, index: number) => {
			farmsObject[farm.farm_id] = farm;
			return farm;
		});
		// Filter for just with pool seed
		const listSeeds = Object.values(await nearPresets.get_list_seeds_info(1, useFluxusVaultContractState)).filter(
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
						let farm = {} as IVaultData;
						farm = farmsObject[farmID];
						farm.token_details = await ftGetTokenMetadata(farm.reward_token, false);
						farm.user_reward = await getRewardByTokenId(
							farm.reward_token,
							undefined,
							useFluxusVaultContractState,
						);
						farm.user_unclaimed_reward = await getUnclaimedReward(
							farmID,
							undefined,
							useFluxusVaultContractState,
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
				let populatedPool = {} as IPopulatedPool;
				populatedPool = (await nearRPCContext.getNearPresets().get_pool_details(poolID)) as IPopulatedPool;
				populatedPool.populated_tokens = await Promise.all(
					populatedPool.token_account_ids.map(async (token_id: string) =>
						ftGetTokenMetadata(token_id, false),
					),
				);
				populatedPool.shares_lptoken = await getSharesInPool(poolID);
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

		// All rewards available from farm contract
		setTimeout(() => {
			// console.log('populatedSeeds: ', populatedSeeds);
			setVaultsState(populatedSeeds);
			setTimeout(() => {
				resetVaultBoxMinHeight();
			}, 800);
		}, 200);
	};

	useEffect(() => {
		loadVaults();
		return () => {
			setVaultsState([]);
		};
	}, [useFluxusVaultContractState]);

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
							<span className={!useFluxusVaultContractState ? 'selected' : ''}>Ref-finance</span>
							{` / `}
							<span className={useFluxusVaultContractState ? 'selected' : ''}>Fluxus</span>.
						</SwitchAreaTitle>
					</SwitchArea>
					<SwitchArea>
						<SwitchAreaTitleTag>{useFluxusVaultContractState ? `Fluxus` : `Ref`}</SwitchAreaTitleTag>
						<Switch
							checked={useFluxusVaultContractState}
							onChange={(event: any) => {
								setUseFluxusVaultContractState(!useFluxusVaultContractState);
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
				<ListVaultsBox data-componentname="valtBoxElement" style={stateVaultsBoxCssStyleProperties}>
					{VaultsState.map((item: IPopulatedSeed, index: number) => (
						<CardVault
							key={item.seed_id}
							populatedSeed={item}
							useFluxusVaultContract={useFluxusVaultContractState}
						/>
					))}
				</ListVaultsBox>
			</WrapBox>
		</>
	);
};

export default VaultList;
