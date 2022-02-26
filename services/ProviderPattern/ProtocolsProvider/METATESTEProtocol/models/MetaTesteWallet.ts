/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
import ProviderPattern from '@ProviderPattern/index';
import { PROTOCOLS } from '@ProviderPattern/constants';
import AbstractMainWallet, { AbstractMainWalletAccount } from '@ProviderPattern/models/AbstractMainWallet';
import { AccountBalance } from 'near-api-js/lib/account';
import { Action, createTransaction, Transaction } from 'near-api-js/lib/transaction';
import METATESTEProtocolProvider from '@ProviderPattern/ProtocolsProvider/METATESTEProtocol/index';
import Web3 from 'web3';

type IBalance = { amount_available: string; balance_details: AccountBalance };
export default class MetaTesteWallet extends AbstractMainWallet {
	declare _connectedAccount: MetaTesteWalletAccount;

	account() {
		if (!this._connectedAccount)
			this._connectedAccount = new MetaTesteWalletAccount(this, this._near.connection, this._authData.accountId);
		return this._connectedAccount;
	}

	createTransaction(props: { receiverId?: string; actions?: Action[]; nonceOffset?: number }) {
		return this.account().createTransaction({});
	}
}
export type ISpecialWalletAccountCreateTransaction = {
	receiverId: string;
	actions: Action[];
	nonceOffset?: number;
};

export class MetaTesteWalletAccount extends AbstractMainWalletAccount {
	public walletProviderName: string = 'MetaTesteWallet';

	protected static _thisProtocolProvider: METATESTEProtocolProvider;

	public static getThisProtocolProvider<T extends unknown>(): T {
		if (this._thisProtocolProvider) {
			return this._thisProtocolProvider as T;
		}

		const provider =
			ProviderPattern.getInstance().getProviderInstanceByProtocolName(
				PROTOCOLS.METATESTE,
			) as unknown;
			this._thisProtocolProvider = provider as METATESTEProtocolProvider;
		return this._thisProtocolProvider as T;
	}

	public static getProvider(): Web3 {
		return MetaTesteWalletAccount.getThisProtocolProvider<METATESTEProtocolProvider>().getConnection<Web3>();
	}

	async getBalance(): Promise<IBalance & { walletProviderName: string }> {
		MetaTesteWalletAccount.getThisProtocolProvider<METATESTEProtocolProvider>().getEthWallet();

		const accountBalance: AccountBalance = { available: '10' } as AccountBalance;
		const available = `${Number(Number(accountBalance.available) / 10 ** 24)}`;
		return {
			amount_available: available,
			balance_details: accountBalance,
			walletProviderName: this.walletProviderName,
		};
	}

	async sendTransactionWithActions(receiverId: string, actions: Action[]) {
		return this.signAndSendTransaction(receiverId, actions);
	}

	async createTransaction(props: { receiverId?: string; actions?: Action[]; nonceOffset?: number }) {
		return { walletProviderName: this.walletProviderName } as Transaction & { walletProviderName: string };
	}
}
