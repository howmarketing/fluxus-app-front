/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, ReactElement } from 'react';
import CryptoJS from 'crypto-js';
import SHA1 from 'crypto-js/sha1';
import Switch from 'react-switch';
import { useNearRPCContext } from '@hooks/index';
import { IFarmData as IVaultData, ISeedInfo, PoolDetails, PoolVolumes } from '@workers/workerNearPresets';
import { TokenMetadata } from '@ProviderPattern/models/Actions/AbstractMainFTContractProviderAction';
import CardVault from '@components/CardVault/index';
import { ICardVaultState } from '@components/CardVault';
import { IPoolFiatPrice } from '@ProviderPattern/models/Actions/AbstractMainProviderAPI';
import ProviderPattern from '@ProviderPattern/index';
import { getWallet } from '@services/near';
import { useSWRFunction } from '@hooks/useSWRFunction';
import { WrapBox, SwitchArea, SwitchAreaTitle, SwitchAreaTitleTag, ListVaultsBox } from './styles';

export type IPopulatedPoolExtraDataToken = { populated_tokens: Array<TokenMetadata>; shares_lptoken: any };
export type IPopulatedPoolExtraDataVolume = { volumes: PoolVolumes };
export type IPopulatedPool = PoolDetails & IPopulatedPoolExtraDataToken;
export type IPopulatedSeed = ISeedInfo & {
	shares_percent?: string | number | undefined;
	shares_tvl?: string | number | undefined;
	populated_farms: Array<IVaultData>;
	pool_id: string | number;
	pool: IPopulatedPool;
	token_from: TokenMetadata;
	token_to: TokenMetadata;
	user_shares?: number | string | undefined;
	user_shares_percent?: number | string | undefined;
	user_shares_tvl?: number | string | undefined;
	vault: {
		shares?: number | string | undefined;
		shares_tvl?: string | number | undefined;
		shares_percent?: number | string | undefined;
		user: {
			shares?: number | string | undefined;
			shares_tvl?: string | number | undefined;
			shares_percent?: number | string | undefined;
		};
	};
};

export type IDefaultVaultItemData = ICardVaultState & { id: string | number };
const VaultList: React.FC = function () {
	const nearRPCContext = useNearRPCContext();
	const nearPresets = nearRPCContext.getNearPresets();
	// Used to keep box height size while rendering the list of farms.
	const [stateVaultsBoxCssStyleProperties, setStateVaultsBoxCssStyleProperties] = useState<React.CSSProperties>({
		minHeight: '300px',
	});
	// Set if it will use the fluxus farm contract (Setted from UI Switch Button).
	const [useFluxusVaultContractState, setUseFluxusVaultContractState] = useState<boolean>(true);
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
			const minHeightAsCurrentHeightValue = `${valtBoxElement[0].clientHeight}px`;

			setStateVaultsBoxCssStyleProperties({
				minHeight: minHeightAsCurrentHeightValue,
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
			});
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	};

	const vaultActions = ProviderPattern.getProviderInstance().getProviderActions().getVaultActions();

	const getVaultStakedList = async ({ useFluxusFarmContract = true }) =>
		vaultActions.getVaultStakedList({ useFluxusFarmContract });

	const getStakedListByAccountId = async ({ useFluxusFarmContract = true }) =>
		ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFarmActions()
			.getStakedListByAccountId({ useFluxusFarmContract });

	const getVaults = async () => {
		// get all user staked LP Tokens
		const stakedLists = [
			getStakedListByAccountId({ useFluxusFarmContract: useFluxusVaultContractState }),
			getVaultStakedList({ useFluxusFarmContract: useFluxusVaultContractState }),
		];
		const [userStakedList, vaultStakedList] = await Promise.all(stakedLists);

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
		// TODO: This should be moved to a context
		const populatedSeeds: Array<IPopulatedSeed> = await Promise.all(
			// TODO: async doesn't work within map functions
			// see https://codezup.com/how-to-use-async-await-with-array-map-in-javascript/ good guide
			listSeeds.map(async (seed, index: number) => {
				const populateSeed = seed as IPopulatedSeed;
				// getPopulatedFarms Promise
				const getPopulatedFarms = () => {
					const farms = seed.farms.map(async (farmID: string, index: number) => {
						let farm = {} as IVaultData;
						farm = farmsObject[farmID];
						farm.token_details = await ProviderPattern.getInstance()
							.getProvider()
							.getProviderActions()
							.getFTContractActions()
							.ftGetTokenMetadata(farm.reward_token, false);
						farm.user_reward = await ProviderPattern.getInstance()
							.getProvider()
							.getProviderActions()
							.getFarmActions()
							.getRewardByTokenId(farm.reward_token, undefined, useFluxusVaultContractState);
						farm.user_unclaimed_reward = await ProviderPattern.getInstance()
							.getProvider()
							.getProviderActions()
							.getFarmActions()
							.getUnclaimedReward(farmID, undefined, useFluxusVaultContractState);
						farmsObject[farmID] = farm;
						return farm;
					});
					return farms;
				};
				populateSeed.populated_farms = await Promise.all(getPopulatedFarms());

				// Pool ID from Seed ID by split @ at the second position
				const getPoolIdFromSeedId = (seed_id: string) => {
					const poolIDFromSeedID = seed_id.split('@').splice(1, 1).join('');
					return parseInt(poolIDFromSeedID, 10);
				};
				const poolID = getPoolIdFromSeedId(populateSeed.seed_id);

				// set the pool ID "12" at the populated seed object
				populateSeed.pool_id = poolID;

				// Set pool data from tvl price
				const poolTvlFiatPrice = await ProviderPattern.getInstance()
					.getProvider()
					.getProviderActions()
					.getAPIActions()
					.getPoolTvlFiatPrice({ pool_id: poolID });
				const populatedPool = { ...poolTvlFiatPrice } as IPoolFiatPrice &
					IPopulatedPoolExtraDataToken &
					IPopulatedPoolExtraDataVolume;

				// Get populated tokens
				const getPopulatedTokens = () => {
					const populatedTokens = populatedPool.token_account_ids.map(async (token_id: string) =>
						ProviderPattern.getInstance()
							.getProvider()
							.getProviderActions()
							.getFTContractActions()
							.ftGetTokenMetadata(token_id, false),
					);
					return populatedTokens;
				};
				populatedPool.populated_tokens = await Promise.all(getPopulatedTokens());
				// Define the pool.
				populateSeed.pool = populatedPool;

				// Define seed shares info
				const defineSeedSharesInfo = () => {
					populateSeed.shares_percent = parseFloat(
						`${Number(`${populateSeed.amount}`) / Number(`${populatedPool.shares_total_supply}`)}`,
					).toFixed(24);
					populateSeed.shares_tvl = parseFloat(
						`${Number(`${populateSeed.shares_percent}`) * Number(`${populateSeed.pool.tvl}`)}`,
					).toFixed(24);
				};
				defineSeedSharesInfo();

				// Define user shares info
				const defineUserSharesInfo = () => {
					populateSeed.user_shares =
						typeof userStakedList[populateSeed.seed_id] !== 'undefined'
							? userStakedList[populateSeed.seed_id]
							: undefined;
					// User shares percent on top of farm
					populateSeed.user_shares_percent = parseFloat(
						`${Number(`${populateSeed.user_shares}`) / Number(`${populateSeed.amount}`)}`,
					).toFixed(24);
					// User shares tvl from they percent on top of farm shares tvl
					populateSeed.user_shares_tvl = parseFloat(
						`${Number(`${populateSeed.user_shares_percent}`) * Number(`${populateSeed.shares_tvl}`)}`,
					).toFixed(24);
				};
				defineUserSharesInfo();

				// Define vault shares info
				const defineVaultSharesInfo = () => {
					const vaultShares =
						typeof vaultStakedList[populateSeed.seed_id] !== 'undefined'
							? vaultStakedList[populateSeed.seed_id]
							: undefined;
					const vaultSharesPercent = parseFloat(
						`${Number(`${vaultShares}`) / Number(`${populateSeed.amount}`)}`,
					).toFixed(24);
					const vaultSharesTvl = parseFloat(
						`${Number(`${vaultSharesPercent}`) * Number(`${populateSeed.shares_tvl}`)}`,
					).toFixed(24);
					populateSeed.vault = {
						shares: vaultShares,
						shares_percent: vaultSharesPercent,
						shares_tvl: vaultSharesTvl,
						user: {
							shares: '0',
							shares_percent: '0',
							shares_tvl: '0',
						},
					};
				};
				defineVaultSharesInfo();

				// Define vault user shares info
				const defineVaultUserSharesInfo = async () => {
					if (!getWallet().isSignedIn()) {
						return;
					}
					const vaultUserShares = await vaultActions.getUserShares({ seed_id: populateSeed.seed_id });
					const vaultUserSharesPercent = parseFloat(
						`${Number(`${vaultUserShares}`) / Number(`${populateSeed.vault.shares}`)}`,
					).toFixed(24);
					const vaultUserSharesTvl = parseFloat(
						`${Number(`${vaultUserSharesPercent}`) * Number(`${populateSeed.vault.shares_tvl}`)}`,
					).toFixed(24);
					populateSeed.vault.user = {
						shares: vaultUserShares,
						shares_percent: vaultUserSharesPercent,
						shares_tvl: vaultUserSharesTvl,
					};
				};
				await defineVaultUserSharesInfo();

				return populateSeed;
			}),
		);
		return populatedSeeds;
	};

	const loadVaults = async () => {
		setVaultBoxMinHeightWithCurrentHeight();
		const populatedSeeds = await getVaults();
		setTimeout(() => {
			setVaultsState(populatedSeeds);
			console.log(populatedSeeds);
			setTimeout(() => {
				resetVaultBoxMinHeight();
			}, 800);
		}, 200);
	};

	const encryptSHA1 = (data: any): string | undefined | CryptoJS.lib.WordArray => {
		try {
			if (typeof data === 'string') {
				try {
					return SHA1(data).toString();
				} catch (stringErr: any) {
					console.error(stringErr);
					return undefined;
				}
			}
			try {
				return SHA1(JSON.stringify(data)).toString();
			} catch (jsonErr: any) {
				console.error(jsonErr);
				return undefined;
			}
		} catch (e: any) {
			console.error(e);
			return undefined;
		}
	};

	const vaultsSWR = useSWRFunction({
		endpoint: `vaultsSWR-${useFluxusVaultContractState ? 'fluxus' : 'ref'}`,
		functionToExec: getVaults,
		argsToExecFunction: {},
		inUseState: VaultsState,
		settableInUseState: setVaultsState,
	});

	const manualVerifyToSetState = () => {
		console.log(`Changed SWR(${vaultsSWR.endpoint}):`, vaultsSWR);
		if (!vaultsSWR?.data) {
			return;
		}
		const vaultStateSHA1 = encryptSHA1(VaultsState);
		const SWRSHA1 = encryptSHA1(vaultsSWR.data);
		console.log({
			vault_state: { sha1: vaultStateSHA1, data: VaultsState },
			vault_swr: { sha1: SWRSHA1, data: vaultsSWR.data },
			is_diff: vaultStateSHA1 !== SWRSHA1,
		});
		if (vaultStateSHA1 !== SWRSHA1) {
			setVaultsState(vaultsSWR.data);
		}
	};

	// useEffect(() => {
	// 	const a = '';
	// }, [vaultsSWR]);

	useEffect(
		() => () => {
			setVaultsState([]);
		},
		[useFluxusVaultContractState],
	);

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
