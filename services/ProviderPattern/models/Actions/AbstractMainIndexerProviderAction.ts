/* eslint-disable camelcase */
import AbstractMainProviderActions from '@ProviderPattern/models/Actions/AbstractMainProviderActions';
import AbstractGenericActions from '@ProviderPattern/models/Actions/AbstractGenericActions';
/* eslint-disable no-underscore-dangle */
import _, { trimStart } from 'lodash';
import moment from 'moment/moment';
import { parseAction } from '@services/transaction';
import ProviderPattern from '@ProviderPattern/index';
import { PoolRPCView } from '@ProviderPattern/models/Actions/AbstractMainProviderAPI';
import getConfig from '../../../config';
import { getWallet } from '../../../near';

export type IParseActionView = (action: any) => Promise<{
	datetime: moment.Moment;
	txUrl: string;
	data: {
		Action: string;
	};
	status: any;
}>;
export type ActionData = Awaited<ReturnType<IParseActionView>>;

type Awaited<T> = T extends Promise<infer P> ? P : never;

const config = getConfig();

export default class AbstractMainIndexerProviderAction extends AbstractGenericActions {
	protected declare devImplementation: any;

	protected static _classInstanceSingleton: AbstractMainIndexerProviderAction;

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

	public async get24hVolume(pool_id: string): Promise<string> {
		this.devImplementation = true;
		return fetch(`${config.sodakiApiUrl}/pool/${pool_id}/rolling24hvolume/sum`, {
			method: 'GET',
		})
			.then(res => res.json())
			.then(monthTVL => monthTVL.toString());
	}

	public async parseActionView(action: any) {
		this.devImplementation = true;
		const data = await parseAction(action[3], action[4], action[2]);
		return {
			datetime: moment.unix(action[0] / 1000000000),
			txUrl: `${config.explorerUrl}/transactions/${action[1]}`,
			data,
			// status: action[5] === 'SUCCESS_VALUE',
			status: action[6] && action[6].indexOf('SUCCESS') > -1,
		};
	}

	public async getYourPools(): Promise<PoolRPCView[]> {
		this.devImplementation = true;
		return fetch(`${config.indexerUrl}/liquidity-pools/${this.getWallet().getAccountId()}`, {
			method: 'GET',
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		})
			.then(res => res.json())
			.then(pools => pools);
	}

	public async getTopPools(args: any): Promise<PoolRPCView[]> {
		this.devImplementation = true;
		return fetch(`${config.indexerUrl}/list-top-pools`, {
			method: 'GET',
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		})
			.then(res => res.json())
			.then(pools => {
				pools = pools.map((pool: any) =>
					ProviderPattern.getInstance()
						.getProvider()
						.getProviderActions()
						.getAPIActions()
						.parsePoolView(pool),
				);
				return this._order(args, this._search(args, pools));
			})
			.catch(() => []);
	}

	public async getPool(pool_id: string): Promise<PoolRPCView> {
		this.devImplementation = true;
		return fetch(`${config.indexerUrl}/get-pool?pool_id=${pool_id}`, {
			method: 'GET',
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		})
			.then(res => res.json())
			.then(pool =>
				ProviderPattern.getInstance().getProvider().getProviderActions().getAPIActions().parsePoolView(pool),
			);
	}

	public async getPoolsByIds({ pool_ids }: { pool_ids: string[] }): Promise<PoolRPCView[]> {
		this.devImplementation = true;
		const ids = pool_ids.join('|');
		return fetch(`${config.indexerUrl}/list-pools-by-ids?ids=${ids}`, {
			method: 'GET',
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		})
			.then(res => res.json())
			.then(pools => {
				pools = pools.map((pool: any) =>
					ProviderPattern.getInstance()
						.getProvider()
						.getProviderActions()
						.getAPIActions()
						.parsePoolView(pool),
				);
				return pools;
			})
			.catch(() => []);
	}

	public async getTokenPriceList(): Promise<any> {
		this.devImplementation = true;
		fetch(`${config.indexerUrl}/list-token-price`, {
			method: 'GET',
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		})
			.then(res => res.json())
			.then(list => list);
	}

	public _search(args: any, pools: PoolRPCView[]) {
		this.devImplementation = true;
		if (args.tokenName === '') return pools;
		return _.filter(
			pools,
			(pool: PoolRPCView) =>
				_.includes(pool.token_symbols[0].toLowerCase(), args.tokenName.toLowerCase()) ||
				_.includes(pool.token_symbols[1].toLowerCase(), args.tokenName.toLowerCase()),
		);
	}

	public _order(args: any, pools: PoolRPCView[]) {
		this.devImplementation = true;
		let column = args.column || 'tvl';
		const order = args.order || 'desc';
		column = args.column === 'fee' ? 'total_fee' : column;
		return _.orderBy(pools, [column], [order]);
	}

	public _pagination(args: any, pools: PoolRPCView[]) {
		this.devImplementation = true;
		return _.slice(pools, (args.page - 1) * args.perPage, args.page * args.perPage);
	}

	public async getLatestActions(): Promise<Array<ActionData>> {
		const $this = this;
		return fetch(`${config.indexerUrl}/latest-actions/${$this.getWallet().getAccountId()}`, {
			method: 'GET',
			headers: { 'Content-type': 'application/json; charset=UTF-8' },
		})
			.then(res => res.json())
			.then(items => {
				const tasks = items.map(async (item: any) => $this.parseActionView(item));
				return Promise.all(tasks);
			});
	}
}
