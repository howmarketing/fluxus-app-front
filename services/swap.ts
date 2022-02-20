/* eslint-disable consistent-return */
import { JsonRpcProvider } from 'near-api-js/lib/providers';
import { BigNumber } from 'bignumber.js';
import { toNonDivisibleNumber, toReadableNumber } from '@utils/numbers';
import {
	executeMultipleTransactions,
	getNear,
	ONE_YOCTO_NEAR,
	REF_FI_CONTRACT_ID,
	RefFiFunctionCallOptions,
	refFiManyFunctionCalls,
	Transaction,
	getWallet,
} from '@services/near';
import { ftGetStorageBalance, TokenMetadata } from '@services/ft-contract';
import { getPoolsByTokens, Pool } from '@services/pool';
import { checkTokenNeedsStorageDeposit, getWhitelistedTokens, round } from '@services/token';
import { storageDepositAction, STORAGE_TO_REGISTER_WITH_MFT } from '@creators/storage';
import { registerTokenAction } from '@creators/token';

const FEE_DIVISOR = 10000;

interface EstimateSwapOptions {
	tokenIn: TokenMetadata;
	tokenOut: TokenMetadata;
	amountIn: string;
	intl?: any;
	setLoadingData?: (loading: boolean) => void;
	loadingTrigger?: boolean;
	setLoadingTrigger?: (loadingTrigger: boolean) => void;
}

export interface EstimateSwapView {
	estimate: string;
	pool: Pool;
	intl?: any;
}
export const estimateSwap = async ({
	tokenIn,
	tokenOut,
	amountIn,
	intl,
	setLoadingData,
	loadingTrigger,
	setLoadingTrigger,
}: EstimateSwapOptions): Promise<EstimateSwapView> => {
	const parsedAmountIn = toNonDivisibleNumber(tokenIn.decimals, amountIn);
	if (!parsedAmountIn)
		throw new Error(
			`${amountIn} ${intl.formatMessage({
				id: 'is_not_a_valid_swap_amount',
			})}`,
		);

	const pools = await getPoolsByTokens({
		tokenInId: tokenIn.id,
		tokenOutId: tokenOut.id,
		amountIn: parsedAmountIn,
		setLoadingData,
		setLoadingTrigger,
		loadingTrigger: loadingTrigger || false,
	});

	if (pools.length < 1) {
		throw new Error(
			`${intl.formatMessage({
				id: 'no_pool_available_to_make_a_swap_from',
			})} ${tokenIn.symbol} -> ${tokenOut.symbol} ${intl.formatMessage({
				id: 'for_the_amount',
			})} ${amountIn} ${intl.formatMessage({
				id: 'no_pool_eng_for_chinese',
			})}`,
		);
	}

	try {
		const estimates = await Promise.all(
			pools.map(pool => {
				const amount_with_fee = Number(amountIn) * (FEE_DIVISOR - pool.fee);
				const in_balance = toReadableNumber(tokenIn.decimals, pool.supplies[tokenIn.id]);
				const out_balance = toReadableNumber(tokenOut.decimals, pool.supplies[tokenOut.id]);
				const estimate = new BigNumber(
					(
						(amount_with_fee * Number(out_balance)) /
						(FEE_DIVISOR * Number(in_balance) + amount_with_fee)
					).toString(),
				).toFixed();

				return Promise.resolve(estimate)
					.then(estimate => ({
						estimate,
						status: 'success',
						pool,
					}))
					.catch(() => ({ status: 'error', estimate: '0', pool }));
			}),
		);

		const { estimate, pool } = estimates
			.filter(({ status }) => status === 'success')
			.sort((a, b) => (Number(b.estimate) > Number(a.estimate) ? 1 : -1))[0];

		return {
			estimate,
			pool,
		};
	} catch (err) {
		throw new Error(
			`${intl.formatMessage({
				id: 'no_pool_available_to_make_a_swap_from',
			})} ${tokenIn.symbol} -> ${tokenOut.symbol} ${intl.formatMessage({
				id: 'for_the_amount',
			})} ${amountIn} ${intl.formatMessage({
				id: 'no_pool_eng_for_chinese',
			})}`,
		);
	}
};

interface SwapOptions extends EstimateSwapOptions {
	pool: Pool;
	minAmountOut: string;
}

interface InstantSwapOption extends SwapOptions {
	useNearBalance: boolean;
}

export const swap = async ({ useNearBalance, pool, tokenIn, tokenOut, amountIn, minAmountOut }: InstantSwapOption) => {
	if (pool) {
		if (useNearBalance) {
			await instantSwap({
				pool,
				tokenIn,
				tokenOut,
				amountIn,
				minAmountOut,
			});
		} else {
			await depositSwap({
				pool,
				tokenIn,
				tokenOut,
				amountIn,
				minAmountOut,
			});
		}
	}
};

export const instantSwap = async ({ pool, tokenIn, tokenOut, amountIn, minAmountOut }: SwapOptions) => {
	const swapAction = {
		pool_id: pool?.id,
		token_in: tokenIn?.id,
		token_out: tokenOut?.id,
		min_amount_out: round(tokenIn.decimals, toNonDivisibleNumber(tokenOut.decimals, minAmountOut)),
	};

	const transactions: Transaction[] = [];
	const tokenInActions: RefFiFunctionCallOptions[] = [];
	const tokenOutActions: RefFiFunctionCallOptions[] = [];

	if (getWallet().isSignedIn()) {
		const tokenOutRegistered = await ftGetStorageBalance(tokenOut.id, getWallet().getAccountId()).catch(() => {
			throw new Error(`${tokenOut.id} doesn't exist.`);
		});

		if (!tokenOutRegistered || tokenOutRegistered.total === '0') {
			tokenOutActions.push({
				methodName: 'storage_deposit',
				args: {
					registration_only: true,
					account_id: getWallet().getAccountId(),
				},
				gas: '30000000000000',
				amount: STORAGE_TO_REGISTER_WITH_MFT,
			});

			transactions.push({
				receiverId: tokenOut.id,
				functionCalls: tokenOutActions,
			});
		}

		tokenInActions.push({
			methodName: 'ft_transfer_call',
			args: {
				receiver_id: REF_FI_CONTRACT_ID,
				amount: toNonDivisibleNumber(tokenIn.decimals, amountIn),
				msg: JSON.stringify({
					force: 0,
					actions: [swapAction],
				}),
			},
			gas: '150000000000000',
			amount: ONE_YOCTO_NEAR,
		});

		transactions.push({
			receiverId: tokenIn.id,
			functionCalls: tokenInActions,
		});

		return executeMultipleTransactions(transactions);
	}
};

export const depositSwap = async ({ pool, tokenIn, tokenOut, amountIn, minAmountOut }: SwapOptions) => {
	const swapAction = {
		pool_id: pool.id,
		token_in: tokenIn.id,
		token_out: tokenOut.id,
		amount_in: round(tokenIn.decimals, toNonDivisibleNumber(tokenIn.decimals, amountIn)),
		min_amount_out: round(tokenIn.decimals, toNonDivisibleNumber(tokenOut.decimals, minAmountOut)),
	};

	const actions: RefFiFunctionCallOptions[] = [
		{
			methodName: 'swap',
			args: { actions: [swapAction] },
			amount: ONE_YOCTO_NEAR,
		},
	];

	const whitelist = await getWhitelistedTokens();
	if (!whitelist.includes(tokenOut.id)) {
		actions.unshift(registerTokenAction(tokenOut.id));
	}

	const neededStorage = await checkTokenNeedsStorageDeposit();
	if (neededStorage) {
		actions.unshift(storageDepositAction({ amount: neededStorage }));
	}

	return refFiManyFunctionCalls(actions);
};

export type ICheckTransaction = ({ transaction: Record<any, any> } & Record<any, any>) | Record<any, any>;
export const checkTransaction = (txHash: string): Promise<ICheckTransaction> => {
	const near = getNear();
	return (near ? (near.connection.provider as JsonRpcProvider) : new JsonRpcProvider())?.sendJsonRpc(
		'EXPERIMENTAL_tx_status',
		[txHash, getWallet().getAccountId()],
	);
};
