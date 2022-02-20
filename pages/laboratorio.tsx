/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { ContactMail, MonetizationOn as Money } from '@material-ui/icons';
import Head from 'next/head';
import { useNearData } from '@hooks/useNearData';
import Landing from '@components/Landing';
import { H1 } from '@components/HomePage/styles';
import ToastNotify, { dispatchToastNotify } from '@components/ToastNotify';
import useDarkMode from '@hooks/useDarkMode';
import { ftGetTokenMetadata } from '@services/ft-contract';
import { getAmount, getWallet } from '@services/near';
import { ICallbackData, nearWalletAsWindow } from '@utils/nearWalletAsWindow';
import ProviderPattern from '@services/ProviderPattern';
import ButtonGhost from '@components/ButtonGhost';
import { BN } from 'bn.js';
import { toNonDivisibleNumber } from '@utils/numbers';
import { AccountView, QueryResponseKind } from 'near-api-js/lib/providers/provider';
import { serialize } from 'near-api-js/lib/utils/index';
import { AccountBalance } from 'near-api-js/lib/account';
import { getRewardByTokenId, getStakedListByAccountId, getUnclaimedReward } from '@services/farm';
import { useNearRPCContext } from '@hooks/index';
import {
	IPopulatedPool,
	IPopulatedPoolExtraDataToken,
	IPopulatedPoolExtraDataVolume,
	IPopulatedSeed,
} from '@components/VaultList';
import { getUserDeposits, IFarmData as IVaultData, ISeedInfo, PoolDetails } from '@workers/workerNearPresets';
import { getSharesInPool } from '@services/pool';
import { getUserTokenBalances } from '@services/token';
import AbstractMainProviderAPI from '@ProviderPattern/models/Actions/AbstractMainProviderAPI';
import { getPoolBalance, getPoolTvlFiatPrice, getPoolTvlFiatPriceHistory, IPoolFiatPrice } from '@services/api';
import AbstractMainVaultProviderActions from '@ProviderPattern/models/Actions/AbstractMainVaultProviderActions';
import AbstractMainProvider from '@ProviderPattern/models/AbstractMainProvider';
import MainProvider from '@ProviderPattern/models/MainProvider';
import { homePageMetaDescribes } from '../consts';

/**
 * DEVELOPMENT PAGE ONLY
 * DO NOT INCLUDE IT INTO CODE REVIEW, BUT LET THIS BE INCLUDED IN COMMIT CHANGES
 * .
 * .
 * .
 * @description Please, do not include this to code review, once this is a really usefull to test featurea and fix as improvement too.
 * @description Even it is just to be used as development, we need to keep as long as development versions, for that reason, this page will keep to be included in commit changes.
 * @author Gabriel Ariza
 */
const Laboratorio: NextPage = function () {
	const { nearPriceState } = useNearData();
	const nearRPCContext = useNearRPCContext();
	const { theme } = useDarkMode();

	// Console log provider pattern instance
	const getProviderPattern = async (DOMProviderPatternName: any = 'ProviderPattern'): Promise<any> => {
		const sendToWindowFunction = async (...arg: any[]) => ProviderPattern.getInstance();
		defineDOMFunction({
			DOMPrefixFunctionName: 'get',
			DOMFunctionName: DOMProviderPatternName,
			executableFunction: sendToWindowFunction,
			acountSameNameFunction: -1,
		});
		return sendToWindowFunction();
	};

	// Console log API instance
	const getApiInstance = async (DOMAsignInstanceName: any = 'ApiInstance'): Promise<any> => {
		const sendToWindowFunction = async (...arg: any[]) => AbstractMainProviderAPI.getInstance();
		defineDOMFunction({
			DOMPrefixFunctionName: 'get',
			DOMFunctionName: DOMAsignInstanceName,
			executableFunction: sendToWindowFunction,
			acountSameNameFunction: -1,
		});
		return sendToWindowFunction();
	};

	// Get provider from window wallet
	const getProviderFromWindowWallet = async (msTime?: number | undefined) => {
		nearWalletAsWindow._makeItWaitBeforeClose = msTime && msTime >= 2000 ? msTime : 2000;
		console.log('nearWalletAsWindow: ', nearWalletAsWindow);
		const windowWalletProvider = await nearWalletAsWindow.getWindowWalletRPC<ProviderPattern>(true);
		return windowWalletProvider.getProvider();
	};
	// Get vault actions from provider as window wallet
	const getVaultActionsFromProviderAsWindow = async (
		msTime?: number | undefined,
	): Promise<{ actions: AbstractMainVaultProviderActions; provider: AbstractMainProvider & MainProvider }> => {
		const provider = await getProviderFromWindowWallet(msTime);
		return { actions: provider.getProviderActions().getVaultActions(), provider };
	};

	// Get provider Instance
	const getProvider = () => ProviderPattern.getProviderInstance();
	// Get Vault actions instance from provider instance
	const getVaultActions = () => getProvider().getProviderActions().getVaultActions();

	type IDefineDOMFunction = {
		DOMPrefixFunctionName: string;
		DOMFunctionName: string;
		executableFunction?: (...args: any[]) => Promise<any>;
		acountSameNameFunction: number;
	};
	const defineDOMFunction = async ({
		DOMPrefixFunctionName = '',
		DOMFunctionName = '',
		executableFunction = undefined,
		acountSameNameFunction = 0,
	}: IDefineDOMFunction): Promise<void> => {
		if (DOMFunctionName.length < 2 || typeof executableFunction === 'undefined') {
			const message =
				DOMFunctionName.length < 2 ? 'Invalid DOM function name length' : 'executableFunction not specified';
			console.error({ message });
			return;
		}
		const DOMSetFunctionName = `${DOMPrefixFunctionName}${DOMFunctionName}`;
		const DOMFunctionNameAsWindowKey = `${DOMSetFunctionName}` as keyof typeof window;
		if (DOMFunctionNameAsWindowKey in window) {
			acountSameNameFunction++;
			if (acountSameNameFunction < 1) {
				return;
			}
			defineDOMFunction({
				DOMPrefixFunctionName: `${DOMPrefixFunctionName}`,
				DOMFunctionName: `${DOMFunctionName}${acountSameNameFunction}`,
				executableFunction,
				acountSameNameFunction,
			});
			return;
		}
		console.log('defining function: ', DOMFunctionNameAsWindowKey);
		Object.defineProperty(window, DOMFunctionNameAsWindowKey, { value: executableFunction, writable: true });
	};

	// Create vault record to API
	const fluxusAPIInsertVaultRecord = async ({
		account_id = 'invalid',
		request_type = 'function_call',
		contract_id = 'api',
		function_name = 'a',
		function_args = {},
		request_extra_data = {},
		transaction_id = '',
		amount = '',
	}: Record<any, any>) => {
		const stringifyMyObject = (entrieName: string = 'data', objectData: Record<any, any> = {}) => {
			let response: string = '';
			try {
				response = JSON.stringify({ [entrieName]: JSON.stringify(function_args) });
			} catch (e: any) {
				response = JSON.stringify({ error: e.message || 'unknown' });
			}
			return response;
		};
		function_args = stringifyMyObject('args', function_args);
		request_extra_data = stringifyMyObject('data', request_extra_data);
		const a = (
			await (
				await fetch('https://fluxus-api-v-vercel-tes-j91kga.herokuapp.com/graphql', {
					headers: {
						accept: '*/*',
						'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
						'content-type': 'application/json',
						'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
						'sec-ch-ua-mobile': '?0',
						'sec-ch-ua-platform': '"macOS"',
						'sec-fetch-dest': 'empty',
						'sec-fetch-mode': 'cors',
						'sec-fetch-site': 'same-origin',
					},
					referrerPolicy: 'no-referrer',
					body: `{"operationName":"createVaultRecorder","variables":{},"query":"mutation createVaultRecorder {\\n  createVaultRecorder(\\n    data: {account_id: \\"${account_id}\\", request_type: ${request_type}, contract_id: \\"${contract_id}\\", function_name: \\"${function_name}\\", function_args: \\"${function_args}\\", amount: \\"${amount}\\", transaction_id: \\"${transaction_id}\\", request_extra_data: \\"${request_extra_data}\\", publishedAt: \\"2022-02-11T13:10:20Z\\"}\\n  ) {\\n    data {\\n      attributes {\\n        account_id: account_id\\n        request_type: request_type\\n        contract_id: contract_id\\n        function_name: function_name\\n        function_args: function_args\\n        amount: amount\\n        transaction_id: transaction_id\\n        request_extra_data: request_extra_data\\n        publishedAt: publishedAt\\n      }\\n    }\\n  }\\n}\\n"}`,
					method: 'POST',
					mode: 'cors',
					credentials: 'omit',
				})
			).json()
		).data.createVaultRecorder.data.attributes;
		return a;
	};

	// LOGIN TO VAULT CONTRACT
	const signInToVaultContract = async () => {
		try {
			const windowWalletProvider = await getProviderFromWindowWallet(4000);

			await windowWalletProvider.getWallet().requestSignIn({
				contractId: windowWalletProvider.getProviderConfigData().FLUXUS_VAULT_CONTRACT_ID,
				methodNames: [
					'withdraw_of_reward',
					'storage_deposit',
					'add_to_vault',
					'withdraw_all',
					'withdraw_all_2',
					'storage_withdraw',
					'get_user_shares',
					'near_to_wrap',
				],
			});
			const walletResponse = await nearWalletAsWindow.getWalletCallback();
			if (!walletResponse.success) {
				alert(walletResponse.message);
				return;
			}
			try {
				window.document.querySelectorAll('body')[0].style.opacity = '0.3';
				setTimeout(() => {
					window.location.href = `${window.location.href}?loggedin=true`;
				}, 2500);
			} catch (e: any) {
				// Error log
				console.log(`Refresh window error.`);
			}
		} catch (e: any) {
			window.alert(`${e?.message || 'Unknown wallet sign request error.'}`);
		}
	};

	// storageDeposit
	const storageDeposit = async ({ amount = '15' }): Promise<ICallbackData> => {
		const vaultActionsFromWindow = await getVaultActionsFromProviderAsWindow(200);
		vaultActionsFromWindow.actions.storageDeposit(amount);
		const walletResponse = await nearWalletAsWindow.getWalletCallback();
		if (!walletResponse.success) {
			alert(walletResponse.message);
		}
		console.log('walletResponse ->storageDeposit response: ', walletResponse);
		return walletResponse;
	};

	const wrapNearBalanceTesteLeo = async ({ account_id = getWallet().getAccountId() }) =>
		getVaultActions().wrapNearBalance(account_id);

	const VAULTStorageBalanceOfTesteLeo = async ({ account_id = getWallet().getAccountId() }) =>
		getVaultActions().execVaultContractAsViewFunction({
			methodName: 'storage_balance_of',
			args: { account_id },
		});

	// WITHDRAW ALL
	const VAULTWithdrawAll = async ({
		seed_id = 'exchange.ref-dev.testnet@193',
		account_id = getWallet().getAccountId(),
	}) => getVaultActions().withdrawAllUserStakedLP({ seed_id, account_id });

	// WITHDRAW ALL 2
	const VAULTWithdrawAll2 = async ({ account_id = getWallet().getAccountId() }) =>
		getVaultActions().withdrawAllUserLiquidityPool({ account_id });

	// STORAGE WITHDRAW
	const VAULTStorageWithdraw = async ({ amount = '1' }) => getVaultActions().withdrawUserStorage({ amount });

	// GET USER SHARES
	const VAULTGetUserShares = async ({ account_id = getWallet().getAccountId() }) =>
		getVaultActions().getUserShares({ account_id });

	const getStakedListByAccountIdFromContract = async ({ account_id = '', useFluxusFarmContract = false }) => {
		const vaultContractID =
			ProviderPattern.getProviderInstance().getConnectionConfigData().FLUXUS_VAULT_CONTRACT_ID || '';
		const accountId = typeof account_id !== 'string' || account_id.length < 2 ? vaultContractID : account_id;
		useFluxusFarmContract = typeof useFluxusFarmContract === 'undefined' ? false : useFluxusFarmContract;
		const stakedList = await getStakedListByAccountId({
			accountId,
			useFluxusFarmContract,
		});
		console.log('getStakedListByAccountIdFromContract', stakedList);
		return stakedList;
	};

	const VAULTGetDepositsTesteLeo = async ({ account_id = getWallet().getAccountId() }) =>
		getVaultActions().execVaultContractAsViewFunction({ methodName: 'get_deposits', args: { account_id } });

	const testAddToVault = async ({ account_id = getWallet().getAccountId() }) => {
		const doFunctionCall = async () => getVaultActions().addToVault({ account_id });
		const response = await doFunctionCall();
		console.log('testAddToVault: ', response);
	};

	const getVaultStakedList = async ({ useFluxusFarmContract = true }) =>
		getVaultActions().getVaultStakedList({ useFluxusFarmContract });

	const getVaultStakeValueFromSeed = async ({ useFluxusFarmContract = true }) =>
		getVaultActions().getVaultStakeValueFromSeed({ useFluxusFarmContract });

	const execVaultContractAsCallFunction = async (
		methodName?: string | undefined,
		extraArgs: string | Record<any, any> = {},
	) => {
		const accountId = getWallet().getAccountId();
		let args = {
			vault_contract: getProvider().getProviderConfigData().FLUXUS_VAULT_CONTRACT_ID,
			account_id: accountId,
		};
		const getMergeedArgsAndExtraArgs = () => {
			if (typeof extraArgs !== 'object') return args;

			const extraArgsKeys = Object.keys(extraArgs);
			const countKeysExtraArgs = extraArgsKeys.length;
			for (let i = 0; i < countKeysExtraArgs; i++) {
				if (extraArgsKeys[i] in args) {
					delete args[extraArgsKeys[i]];
				}
			}
			return { ...args, ...extraArgs };
		};

		args = getMergeedArgsAndExtraArgs();
		console.log('execVaultContractAsCallFunction(mergedArgs): ', args);
		const action = getVaultActions().execVaultContractAsCallFunction;
		const response = await action<any>({ methodName, args });
		console.log('execVaultContractAsCallFunction: ', response);
	};

	// List of seeds to show farms at farm box component
	const [VaultsState, setVaultsState] = useState<Array<IPopulatedSeed>>([] as Array<IPopulatedSeed>);

	/**
	 * LOAD VAULT AS VAULT LIST PAGE LOAD THEY DATA
	 * @description Testing some ways to calculate the user experience with callback data as view interface
	 */
	const loadVaults = async ({ useFluxusVaultContractState = false }) => {
		const nearPresets = nearRPCContext.getNearPresets();
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
				populateSeed.shares_percent = parseFloat(
					`${Number(`${populateSeed.amount}`) / Number(`${populatedPool.shares_total_supply}`)}`,
				).toFixed(24);
				populateSeed.shares_tvl = parseFloat(
					`${Number(`${populateSeed.shares_percent}`) * Number(`${populateSeed.pool.tvl}`)}`,
				).toFixed(24);
				populateSeed.token_from = await ftGetTokenMetadata(populateSeed.pool.token_account_ids[0]);
				populateSeed.token_to = await ftGetTokenMetadata(populateSeed.pool.token_account_ids[1]);
				populateSeed.user_shares =
					typeof userStakedList[populateSeed.seed_id] !== 'undefined'
						? userStakedList[populateSeed.seed_id]
						: undefined;
				populateSeed.user_shares_percent = parseFloat(
					`${Number(`${populateSeed.user_shares}`) / Number(`${populateSeed.amount}`)}`,
				).toFixed(24);
				populateSeed.user_shares_tvl = parseFloat(
					`${Number(`${populateSeed.user_shares_percent}`) * Number(`${populateSeed.shares_tvl}`)}`,
				).toFixed(24);
				return populateSeed;
			}),
		);
		// All rewards available from farm contract
		setTimeout(() => {
			setVaultsState(populatedSeeds);
		}, 200);
		return populatedSeeds;
	};

	// Get account deposits from farm contract
	const getRefFarmUsersDeposits = async ({ account_id = undefined, contract_id = undefined, debug = false }) => {
		const provider = getProvider();
		const providerConfig = provider.getProviderConfigData();
		const args = {
			account_id: account_id || providerConfig.FLUXUS_VAULT_CONTRACT_ID || '',
			contract_id: contract_id || providerConfig.REF_FI_CONTRACT_ID || '',
			debug,
		};
		console.log('getRefFarmUsersDeposits: ', args);
		return getUserTokenBalances(args);
	};

	// TestAction Props
	type IDefaultExecuteVaultFunction = (methodName?: any | undefined, args?: any | undefined) => Promise<any>;
	type ISpecifyedFunction = (args?: any | undefined) => Promise<any>;
	type IFunctionToBeExecuted = IDefaultExecuteVaultFunction | ISpecifyedFunction;

	type ITestActions = { id: string; methodName: string; label: string; functionToBeExecuted: IFunctionToBeExecuted };

	const [actionsState, setActionsState] = useState<Array<ITestActions>>([] as ITestActions[]);

	const setTestActionsState = () => {
		const actions: Array<ITestActions> = [];

		const pushAction = (pushActionProps: {
			id?: string | undefined;
			methodName?: string | undefined;
			args?: any;
			label?: string | undefined;
			functionName: string;
			functionToBeExecuted?: IFunctionToBeExecuted;
		}) => {
			const { id, methodName, args, label, functionName, functionToBeExecuted } = pushActionProps;
			const pushId = id ? `${id}-${actions.length}` : `id-${actions.length}`;

			const pushFunctionToBeExecuted = async (): Promise<{
				success: boolean;
				msg: string;
				data?: any | undefined;
			}> => {
				const functionToBeExecutedExists = typeof functionToBeExecuted === 'function';
				const methodNameExists = !!(typeof methodName === 'string' && methodName.length > 1);

				const impossibleToRun = !functionToBeExecutedExists && !methodNameExists;
				const executeMainFunctionAsDefaultForMethodName = methodNameExists && !functionToBeExecutedExists;
				let ToastNotifyTitle: string = '';
				// (UX ALERT; STOP PROCCESS ) if NONE of the  functionToBeExecuted and methodName exist, it would be impossible to execute even with the main function as default
				if (impossibleToRun) {
					ToastNotifyTitle = `Could not register action for "${label || 'unknown action'}"`;
					console.log(`${ToastNotifyTitle}: `, {
						functionToBeExecutedExists,
						methodNameExists,
						...pushActionProps,
					});
					dispatchToastNotify({ title: ToastNotifyTitle });
					return { success: true, msg: ToastNotifyTitle, data: {} };
				}
				// (UX ALERT) - If has not a function to be executed, but have a method name, main function will be executed as default with methodName as argument
				if (executeMainFunctionAsDefaultForMethodName) {
					ToastNotifyTitle = `Method "${methodName}" will be executed as default execution`;
				}
				// (UX ALERT) - If has function to be executed,
				if (functionToBeExecutedExists) {
					ToastNotifyTitle = `Function execution for "${label}" ${
						methodNameExists ? `as ${methodName} method` : ''
					}`;
				}
				// (UX ALERT) - Dispatch user information with toat notifyer
				dispatchToastNotify({ title: ToastNotifyTitle });

				// Define where the result should be aloc
				let functionExecutedResponse: { success: boolean; msg: string; data?: any | undefined };

				// Define where the function should be aloc
				let functionExecuted: IFunctionToBeExecuted;
				// Params to be passed to the function
				const params = [methodName, args || {}];
				// Aloc the function to be executed
				if (typeof functionToBeExecuted === 'function') {
					params.splice(0, 1);
					functionExecuted = functionToBeExecuted as ISpecifyedFunction;
				} else {
					functionExecuted = execVaultContractAsCallFunction as IDefaultExecuteVaultFunction;
				}
				// Exectue the function and record the result as success our not with catch error
				try {
					const displayFunctionAccessName = `${functionName.length >= 2 ? functionName : pushId}`;
					console.log(params);
					console.log(
						`


================ ${displayFunctionAccessName} =================

let ${displayFunctionAccessName}_response = await action_${displayFunctionAccessName}(${
							Array.isArray(params) ? params.join(', ') : JSON.stringify(params[0])
						});
console.log("${displayFunctionAccessName}_response: ", ${displayFunctionAccessName}_response)


================ ${displayFunctionAccessName} =================

`.toString(),
					);
					const executionResponse = await functionExecuted(...params);
					functionExecutedResponse = {
						success: true,
						msg: 'Executed successfully executed',
						data: executionResponse,
					};
				} catch (e: any) {
					console.error(e);
					functionExecutedResponse = {
						success: false,
						msg: `Failed function for method ${methodName || 'no method'}`,
						data: {},
					};
				}
				console.log('Function Executed Response: ', functionExecutedResponse);
				return functionExecutedResponse;
			};
			const pushData = {
				id: pushId,
				methodName: methodName || '',
				label: `${label || ''} (${Number(actions.length) + 1})`,
				functionToBeExecuted: pushFunctionToBeExecuted,
			};
			console.log('Pushing action: ', pushData);
			actions.push(pushData);
			defineDOMFunction({
				DOMPrefixFunctionName: 'action_',
				DOMFunctionName: `${functionName.length >= 2 ? functionName : pushId}`,
				executableFunction: functionToBeExecuted,
				acountSameNameFunction: 0,
			});
		};

		// Load Vaults
		// List all farms from farm contract (Ref / Fluxus)
		pushAction({
			id: 'loadVaults',
			methodName: 'loadVaults',
			label: 'Load Vaults',
			args: { useFluxusVaultContractState: false },
			functionName: 'loadVaults',
			functionToBeExecuted: loadVaults,
		});

		// Get Ref Users Deposits
		pushAction({
			id: 'getRefFarmUsersDeposits',
			methodName: 'getRefFarmUsersDeposits',
			args: {},
			functionName: 'getRefFarmUsersDeposits',
			label: 'Get Ref Farm Users Deposits',
			functionToBeExecuted: getRefFarmUsersDeposits,
		});

		// Get Provider Pattern
		// Get Provider Pattern as load to local DOM
		pushAction({
			id: 'getProviderPattern',
			methodName: 'getProviderPattern',
			args: 'providerPattern',
			functionName: 'ProviderPattern',
			label: 'Get provider Pattern.',
			functionToBeExecuted: getProviderPattern,
		});

		// Get API Instance
		// Get API Pinstance as load to local DOM
		pushAction({
			id: 'getApiInstance',
			methodName: 'getApiInstance',
			args: 'ApiInstance',
			functionName: 'getApiInstance',
			label: 'Get API Instance.',
			functionToBeExecuted: getApiInstance,
		});

		// Login
		pushAction({
			id: 'login',
			methodName: 'Login to vault',
			label: 'Do user login to vault contract.',
			functionName: `signInToVaultContract`,
			args: {},
			functionToBeExecuted: signInToVaultContract,
		});

		// Deposit
		pushAction({
			id: 'Deposit',
			methodName: '',
			label: 'Deposit near to vault',
			functionName: `storageDeposit`,
			args: { amount: '2' },
			functionToBeExecuted: storageDeposit,
		});

		// WrapNear
		pushAction({
			id: 'WrapNear',
			methodName: '',
			label: 'Wrap user Vault  balance',
			functionName: `wrapNearBalanceTesteLeo`,
			args: {},
			functionToBeExecuted: wrapNearBalanceTesteLeo,
		});

		// Add to vault
		pushAction({
			id: 'AddToVault',
			methodName: 'add_to_vault',
			label: 'Add to vault',
			functionName: 'AddToVault',
			args: {},
			functionToBeExecuted: testAddToVault,
		});

		// withDrawAll
		pushAction({
			id: 'withDrawAll',
			methodName: 'withdraw_all',
			label: 'Withdraw all',
			functionName: `VAULTWithdrawAll`,
			args: {},
			functionToBeExecuted: VAULTWithdrawAll,
		});

		// WITHDRAW ALL 2
		pushAction({
			id: 'withDrawAll2',
			methodName: 'withdraw_all_2',
			label: 'Withdraw all 2',
			functionName: `VAULTWithdrawAll2`,
			args: {},
			functionToBeExecuted: VAULTWithdrawAll2,
		});

		// STORAGE WITHDRAW
		pushAction({
			id: 'storageWithdraw',
			methodName: 'storage_withdraw',
			label: 'Storage withdraw',
			functionName: `VAULTStorageWithdraw`,
			args: { amount: '1.92' },
			functionToBeExecuted: VAULTStorageWithdraw,
		});

		// Storage balance of
		pushAction({
			id: 'storage_balance_of',
			methodName: 'storage_balance_of',
			label: 'Storage balance of',
			functionName: `VAULTStorageBalanceOfTesteLeo`,
			args: { account_id: getWallet().getAccountId() },
			functionToBeExecuted: VAULTStorageBalanceOfTesteLeo,
		});

		// Get Vault user shares
		pushAction({
			id: 'VAULTGetUserShares',
			methodName: getWallet().getAccountId(),
			label: `Get ${getWallet().getAccountId() || 'logged user'} shares`,
			functionName: `VAULTGetUserShares`,
			args: { account_id: getWallet().getAccountId() },
			functionToBeExecuted: VAULTGetUserShares,
		});

		// Get user staked list
		// From Ref, bring all Vault contract staked list
		pushAction({
			id: 'getStakedListByAccountIdFromContract',
			methodName: 'vaultContractID',
			label: `Get ${getWallet().getAccountId()} statked list`,
			functionName: `getStakedListByAccountIdFromContract`,
			args: {
				account_id: getWallet().getAccountId(),
				useFluxusFarmContract: false,
			},
			functionToBeExecuted: getStakedListByAccountIdFromContract,
		});

		// Get Vault staked list
		// From Ref, bring all Vault contract staked list
		pushAction({
			id: 'getVaultStakedList',
			methodName: '',
			label: 'Get vault statked list',
			functionName: `getVaultStakedList`,
			args: {},
			functionToBeExecuted: getVaultStakedList,
		});

		// Get Vault staked list
		// From Ref, bring all Vault contract staked list
		pushAction({
			id: 'getVaultStakeValueFromSeed',
			methodName: '',
			label: 'Get vault staked value from seed 193',
			functionName: `getVaultStakeValueFromSeed193`,
			args: { useFluxusFarmContract: true },
			functionToBeExecuted: getVaultStakeValueFromSeed,
		});

		// Get Vault StakedList for account
		// From Ref, bring all user  staked list
		pushAction({
			id: 'getStakedListByAccountIdFromContract',
			methodName: 'getStakedListByAccountIdFromContract',
			label: `Get ${getWallet().getAccountId() || 'logged user'} statked list`,
			functionName: `getStakedListByAccountIdFromContract`,
			args: { account_id: getWallet().getAccountId(), useFluxusFarmContract: false },
			functionToBeExecuted: getStakedListByAccountIdFromContract,
		});

		// Get user balance
		/* pushAction({id: 'getUserBalance', methodName: 'wallet_get_user_balance', label: 'Get user balance', functionName: `getUserBalance`, functionToBeExecuted: getUserBalance,}); */

		// Get Deposits
		// Get deposits balance vault custodit for user account_id
		pushAction({
			id: 'get_deposits',
			methodName: 'get_deposits',
			label: 'Get Deposits',
			functionName: `VAULTGetDepositsTesteLeo`,
			functionToBeExecuted: VAULTGetDepositsTesteLeo,
		});

		// API Vault Recorders (insert)
		// Create record about vault contract interactions to fluxus API endpoint
		pushAction({
			id: 'fluxusAPIInsertVaultRecord',
			methodName: 'fluxusAPIInsertVaultRecord',
			label: 'API Create Vault Record',
			args: {
				account_id: 'laboratorio.testnet',
				request_type: 'function_call',
				contract_id: 'api',
				function_name: 'a',
				function_args: { pushAction: 'default test' },
				request_extra_data: { pushAction: 'default test' },
				transaction_id: 'NO-1643376891746',
				amount: '3.14159265359',
			},
			functionName: 'fluxusAPIInsertVaultRecord',
			functionToBeExecuted: fluxusAPIInsertVaultRecord,
		});

		// getSharesInPool
		pushAction({
			id: 'getSharesInPool',
			methodName: 'getSharesInPool',
			label: 'Get shares in pool',
			args: { pool_id: 193, account_id: getProvider().getProviderConfigData().FLUXUS_VAULT_CONTRACT_ID },
			functionName: 'getSharesInPool',
			functionToBeExecuted: getSharesInPool,
		});

		// getPoolTvlFiatPriceHistory
		pushAction({
			id: 'getPoolTvlFiatPriceHistory',
			methodName: '',
			label: 'Get pool TVL Fiat Price History',
			args: { pool_id: 107 },
			functionName: 'getPoolTvlFiatPriceHistory',
			functionToBeExecuted: getPoolTvlFiatPriceHistory,
		});
		// getPoolTvlFiatPrice
		pushAction({
			id: 'getPoolTvlFiatPrice',
			methodName: '',
			label: 'Get pool TVL Fiat Price',
			args: { pool_id: 107 },
			functionName: 'getPoolTvlFiatPrice',
			functionToBeExecuted: getPoolTvlFiatPrice,
		});

		setActionsState(actions);
	};

	const getUserBalance = () => getWallet().account().getBalance();
	const repeatMatrix = (qt = 20) =>
		Object.assign(new Array(qt).fill(1), []).map((itemA, index) => Number(itemA) + Number(index));
	useEffect(() => {
		setTestActionsState();
	}, []);

	useEffect(() => {
		console.log(actionsState);
	}, [actionsState]);

	return (
		<>
			<Head>
				<title>
					{homePageMetaDescribes.title} {nearPriceState?.usd || '...'}
				</title>
			</Head>
			<Landing
				background={{
					backgroundImage: 'bg-home-min.jpg',
					backgroundColor: '#100317',
				}}>
				<>
					{/* <ToastNotify theme="DARK" Icon={Money} autoClose={12000} title="Money..." />
					<ToastNotify theme="LIGHT" Icon={ContactMail} autoClose={12000} title="Sending mail to..." /> */}
					<H1 title="Laboratório de testes.">Laboratório de testes.</H1>
					{actionsState.map((action, index: number) => (
						<div
							key={`${action.id}-${action.methodName}`}
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column',
								flexWrap: 'wrap',
							}}>
							<ButtonGhost
								title={action.methodName}
								key={action.id}
								onClick={() => {
									action.functionToBeExecuted();
								}}>
								{action.label}
							</ButtonGhost>

							{repeatMatrix(45).map((item, index: number) => (
								<hr key={`${action.id}-${item}`} />
							))}
						</div>
					))}
				</>
			</Landing>
		</>
	);
};

export default Laboratorio;
