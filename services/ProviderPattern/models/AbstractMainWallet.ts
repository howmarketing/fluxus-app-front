/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
import { baseDecode } from 'borsh';
import { ConnectedWalletAccount, WalletConnection } from 'near-api-js';
import { AccountBalance } from 'near-api-js/lib/account';
import { Action, createTransaction } from 'near-api-js/lib/transaction';
import { PublicKey } from 'near-api-js/lib/utils';

type IBalance = { amount_available: string; balance_details: AccountBalance };
export default class AbstractMainWallet extends WalletConnection {
	declare _connectedAccount: AbstractMainWalletAccount;

	account() {
		if (!this._connectedAccount) {
			this._connectedAccount = new AbstractMainWalletAccount(
				this,
				this._near.connection,
				this._authData.accountId,
			);
		}

		return this._connectedAccount;
	}

	createTransaction({
		receiverId,
		actions,
		nonceOffset = 1,
	}: {
		receiverId: string;
		actions: Action[];
		nonceOffset?: number;
	}) {
		return this.account().createTransaction({
			receiverId,
			actions,
			nonceOffset,
		});
	}
}
export type ISpecialWalletAccountCreateTransaction = {
	receiverId: string;
	actions: Action[];
	nonceOffset?: number;
};

export class AbstractMainWalletAccount extends ConnectedWalletAccount {
	async getBalance(): Promise<IBalance> {
		const accountBalance: AccountBalance = await this.getAccountBalance();
		const available = `${Number(Number(accountBalance.available) / 10 ** 24)}`;
		return { amount_available: available, balance_details: accountBalance };
	}

	async sendTransactionWithActions(receiverId: string, actions: Action[]) {
		return this.signAndSendTransaction(receiverId, actions);
	}

	async createTransaction({
		receiverId,
		actions,
		nonceOffset = 1,
	}: {
		receiverId: string;
		actions: Action[];
		nonceOffset?: number;
	}) {
		const localKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
		const accessKey = await this.accessKeyForTransaction(receiverId, actions, localKey);
		if (!accessKey) {
			throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`);
		}

		const block = await this.connection.provider.block({
			finality: 'final',
		});
		const blockHash = baseDecode(block.header.hash);

		const publicKey = PublicKey.from(accessKey.public_key);
		const nonce = accessKey.access_key.nonce + nonceOffset;

		return createTransaction(this.accountId, publicKey, receiverId, nonce, actions, blockHash);
	}
}
