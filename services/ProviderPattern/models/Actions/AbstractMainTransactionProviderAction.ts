import AbstractMainProviderActions from '@ProviderPattern/models/Actions/AbstractMainProviderActions';
import AbstractGenericActions from '@ProviderPattern/models/Actions/AbstractGenericActions';
import { TokenMetadata } from '@ProviderPattern/models/Actions/AbstractMainFTContractProviderAction';
import { toReadableNumber } from '@utils/numbers';
import ProviderPattern from '@ProviderPattern/index';

export default class AbstractMainTransactionProviderAction extends AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AbstractMainTransactionProviderAction;

	protected declare _providerActionsInstace: AbstractMainProviderActions;

	/**
	 * GET THE SINGLETON INSTANCE OF THIS CLASS
	 */
	public static getInstance(providerActionsInstance: AbstractMainProviderActions) {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp(providerActionsInstance);
		return this._classInstanceSingleton;
	}

	/**
	 * GET THE PROVICER ACTIONS INSTACE
	 */
	public getProviderActionsInstace() {
		return this._providerActionsInstace;
	}

	/**
	 * GET THE TOKEN ACTIONS INSTACE
	 */
	protected getTokenActionsInstance() {
		return this.getProviderActionsInstace().getTokenActions();
	}

	/**
	 * GET THE ACCOUNT ACTIONS INSTACE
	 */
	protected getAccountActionsInstance() {
		return this.getProviderActionsInstace().getAccountActions();
	}

	/**
	 * GET THE VAULTS ACTIONS INSTACE
	 */
	protected getVaultsActionsInstance() {
		return this.getProviderActionsInstace().getVaultActions();
	}

	/**
	 * GET THE FT CONTRACT ACTIONS INSTACE
	 */
	protected getFTContractActionsInstance() {
		return this.getProviderActionsInstace().getFTContractActions();
	}

	public async parseAction(methodName: string, params: any, tokenId?: string) {
		this.devImplementation = true;
		switch (methodName) {
			case 'swap': {
				return this.parseSwap(params);
			}
			case 'withdraw': {
				return this.parseWithdraw(params);
			}
			case 'register_tokens': {
				return this.parseRegisterTokens(params);
			}
			case 'add_liquidity': {
				return this.parseAddLiquidity(params);
			}
			case 'remove_liquidity': {
				return this.parseRemoveLiquidity(params);
			}
			case 'add_simple_pool': {
				return this.parseAddSimplePool(params);
			}
			case 'storage_deposit': {
				return this.parseStorageDeposit();
			}
			case 'mft_transfer_call': {
				return this.parseMtfTransferCall(params);
			}
			case 'withdraw_seed': {
				return this.parseWithdrawSeed(params);
			}
			case 'claim_reward_by_farm': {
				return this.parseClaimRewardByFarm(params);
			}
			case 'claim_reward_by_seed': {
				return this.parseClaimRewardBySeed(params);
			}
			case 'withdraw_reward': {
				return this.parseWithdrawReward(params);
			}
			case 'near_deposit': {
				return this.parseNearDeposit();
			}
			case 'ft_transfer_call': {
				return this.parseFtTransferCall(params, `${tokenId || ''}`);
			}
			case 'near_withdraw': {
				return this.parseNearWithdraw(params);
			}
			default: {
				return this.parseDefault();
			}
		}
	}

	public async parseSwap(params: any) {
		this.devImplementation = true;
		const in_token = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFTContractActions()
			.ftGetTokenMetadata(params.actions[0].token_in);
		const out_token = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFTContractActions()
			.ftGetTokenMetadata(params.actions[0].token_out);

		return {
			Action: 'Swap',
			'Pool Id': params.actions[0].pool_id,
			'Amount In': toReadableNumber(in_token.decimals, params.actions[0].amount_in),
			'Min Amount Out': toReadableNumber(out_token.decimals, params.actions[0].min_amount_out),
			'Token In': in_token.symbol,
			'Token Out': out_token.symbol,
		};
	}

	public async parseWithdraw(params: any) {
		this.devImplementation = true;
		const token = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFTContractActions()
			.ftGetTokenMetadata(params.token_id);

		return {
			Action: 'Withdraw',
			Amount: toReadableNumber(token.decimals, params.amount),
			Token: token.symbol,
			'Token Address': token.id,
		};
	}

	public async parseRegisterTokens(params: any) {
		this.devImplementation = true;
		return {
			Action: 'Register Tokens',
			'Token Ids': params.token_ids.join(','),
		};
	}

	public async parseAddLiquidity(params: any) {
		this.devImplementation = true;
		const pool = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getPoolActions()
			.getPoolDetails(params.pool_id);
		const tokens = await Promise.all<TokenMetadata>(
			pool.tokenIds.map(id =>
				ProviderPattern.getInstance()
					.getProvider()
					.getProviderActions()
					.getFTContractActions()
					.ftGetTokenMetadata(id),
			),
		);

		return {
			Action: 'Add Liquidity',
			'Pool Id': params.pool_id,
			'Amount One': toReadableNumber(tokens[0].decimals, params.amounts[0]),
			'Amount Two': toReadableNumber(tokens[1].decimals, params.amounts[1]),
		};
	}

	public async parseRemoveLiquidity(params: any) {
		this.devImplementation = true;
		const pool = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getPoolActions()
			.getPoolDetails(params.pool_id);
		const tokens = await Promise.all<TokenMetadata>(
			pool.tokenIds.map(id =>
				ProviderPattern.getInstance()
					.getProvider()
					.getProviderActions()
					.getFTContractActions()
					.ftGetTokenMetadata(id),
			),
		);

		return {
			Action: 'Remove Liquidity',
			'Pool Id': params.pool_id,
			'Amount One': toReadableNumber(tokens[0].decimals, params.min_amounts[0]),
			'Amount Two': toReadableNumber(tokens[1].decimals, params.min_amounts[1]),
			Shares: toReadableNumber(24, params.shares),
		};
	}

	public async parseAddSimplePool(params: any) {
		this.devImplementation = true;
		return {
			Action: 'Add Pool',
			Fee: params.fee,
			'Token One': params.tokens[0],
			'Token Two': params.tokens[1],
		};
	}

	public async parseStorageDeposit() {
		this.devImplementation = true;
		return {
			Action: 'Storage Deposit',
		};
	}

	public async parseMtfTransferCall(params: any) {
		this.devImplementation = true;
		const { amount, receiver_id, token_id } = params;
		return {
			Action: 'Stake',
			Amount: toReadableNumber(24, amount),
			'Receiver Id': receiver_id,
			'Token Id': token_id,
		};
	}

	public async parseWithdrawSeed(params: any) {
		this.devImplementation = true;
		const { seed_id, amount } = params;
		return {
			Action: 'Unstake',
			Amount: toReadableNumber(24, amount),
			'Seed Id': seed_id,
		};
	}

	public async parseClaimRewardByFarm(params: any) {
		this.devImplementation = true;
		const { farm_id } = params;
		return {
			Action: 'Claim reward by farm',
			'Farm Id': farm_id,
		};
	}

	public async parseClaimRewardBySeed(params: any) {
		this.devImplementation = true;
		const { seed_id } = params;
		return {
			Action: 'Claim reward by seed',
			'Seed Id': seed_id,
		};
	}

	public async parseWithdrawReward(params: any) {
		this.devImplementation = true;
		const { token_id, amount, unregister } = params;
		const token = await ProviderPattern.getInstance()
			.getProvider()
			.getProviderActions()
			.getFTContractActions()
			.ftGetTokenMetadata(token_id);
		return {
			Action: 'Withdraw reward',
			Amount: toReadableNumber(token.decimals, amount),
			Unregister: unregister,
			'Token Id': token_id,
		};
	}

	public async parseNearDeposit() {
		this.devImplementation = true;
		return {
			Action: 'Near deposit',
		};
	}

	public async parseFtTransferCall(params: any, tokenId: string) {
		this.devImplementation = true;
		const { receiver_id, amount, msg } = params;
		let Action;
		let Amount;
		if (msg) {
			Action = 'Instant swap';
			const actions = JSON.parse(msg).actions[0];
			const { token_in } = actions;
			const token = await ProviderPattern.getInstance()
				.getProvider()
				.getProviderActions()
				.getFTContractActions()
				.ftGetTokenMetadata(token_in);
			Amount = toReadableNumber(token.decimals, amount);
		} else {
			Action = 'Deposit';
			const token = await ProviderPattern.getInstance()
				.getProvider()
				.getProviderActions()
				.getFTContractActions()
				.ftGetTokenMetadata(tokenId);
			Amount = toReadableNumber(token.decimals, amount);
		}
		return {
			Action,
			Amount,
			'Receiver Id': receiver_id,
		};
	}

	public async parseNearWithdraw(params: any) {
		this.devImplementation = true;
		const { amount } = params;
		return {
			Action: 'Near withdraw',
			Amount: toReadableNumber(24, amount),
		};
	}

	public async parseDefault() {
		this.devImplementation = true;
		return {
			Action: 'Not Found',
		};
	}
}
