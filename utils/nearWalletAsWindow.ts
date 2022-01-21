/* eslint-disable no-undef */
import { INearRPCContext } from '@contexts/nearData/nearRPCData';
import { reject } from 'lodash';
import { finished } from 'stream';

export type IWalletWindowReference = Window & typeof globalThis & { nearRPC: INearRPCContext };
export type IWalletAsWindowErrorType = { success: boolean; message: string; extra: any };
export type ICallbackData = {
	finished: boolean;
	success: boolean;
	message: string;
	data: Record<any, any>;
	finishedTime: number;
	totalExecutionTime: number;
};
export const nearWalletAsWindow = {
	opnerWindow: {} as Window,
	walletWindowReference: {} as Window,
	callbackData: {} as ICallbackData,

	async getWindowWalletRPC() {
		try {
			const setupRersponse = await this._setUp();
			if (!setupRersponse.success) {
				throw new Error(setupRersponse.message);
			}
			const walletWindowDOM = this._getWalletWindow();
			this.walletWindowReference.focus();
			const rpcProvider = await new Promise<INearRPCContext | undefined>((resolve, reject) => {
				const rpcTimeout = setTimeout(() => {
					resolve(undefined);
				}, 12000);
				const loadingNearPresets = setInterval(() => {
					if (
						typeof walletWindowDOM.nearRPC !== 'undefined' &&
						typeof walletWindowDOM.nearRPC.getNearPresets !== 'undefined'
					) {
						clearTimeout(rpcTimeout);
						clearInterval(loadingNearPresets);
						resolve(walletWindowDOM.nearRPC);
					}
				}, 500);
			});

			if (typeof rpcProvider === 'undefined') {
				throw new Error(`Wallet get timed out while try to get NEAR RPC Provider. `);
			}
			this._watchTransactionCallback();
			return rpcProvider;
		} catch (e: any) {
			throw new Error(`${e?.message || 'Unknown error'}`);
		}
	},

	async getWalletCallback($limitCallbackTimeout: number = 360000) {
		const $this = this;
		try {
			const walletHasNoTimedOut = await new Promise((resolve, reject) => {
				let timeout = setTimeout(() => {});
				const interval = setInterval(() => {
					console.log('wallet waiting callback.');
					if ($this.callbackData.finished) {
						clearInterval(interval);
						clearTimeout(timeout);
						resolve(true);
					}
				}, 500);
				timeout = setTimeout(
					() => {
						clearInterval(interval);
						clearTimeout(timeout);
						resolve(false);
					},
					$limitCallbackTimeout < 20000
						? 20000
						: $limitCallbackTimeout > 360000
						? 360000
						: $limitCallbackTimeout,
				);
			});
			if (!walletHasNoTimedOut) {
				$this.callbackData.finished = true;
				$this.callbackData.success = false;
				$this.callbackData.message = `Wallet has timed out to get callback. Callback current message: ${$this.callbackData.message}`;
			}
			return $this.callbackData;
		} catch (e: any) {
			$this.callbackData.finished = true;
			$this.callbackData.message = `Error to get wallet callback: ${
				e?.message || 'Unknown error'
			}. Callback current message: ${$this.callbackData.message}`;
			return $this.callbackData;
		}
	},

	async _setUp() {
		try {
			await this._resetProps();
			await this._defineOpnerWindow();
			await this._defineWalletWindow();
			return {
				success: true,
				message: `Wallet setted successfully.`,
				extra: {},
			};
		} catch (e: any) {
			return {
				success: false,
				message: `${e?.message || 'Some error occurred when setting up the wallet properies.'}`,
				extra: e,
			};
		}
	},

	async _resetProps() {
		try {
			this.callbackData = { finished: false, success: false, message: '', data: {} } as ICallbackData;
			if (this._verifyIfWalletWindowIsOpen()) {
				this.walletWindowReference?.focus();
				this.walletWindowReference?.close();
			}
			this.opnerWindow = {} as Window;
			await this._defineOpnerWindow();
			this.walletWindowReference = {} as Window;
			return true;
		} catch (e: any) {
			console.error(e);
			return false;
		}
	},

	async _defineOpnerWindow() {
		const $this = this;
		try {
			$this.opnerWindow = window;
		} catch (e: any) {
			throw new Error(`Window document error message: ${e?.message || 'unknown'}`);
		}
	},

	async _defineWalletWindow() {
		const $this = this;
		try {
			if (!this._verifyIfWalletWindowIsOpen()) {
				await this._resetProps();
				await new Promise<boolean>((resolve, reject) => {
					setTimeout(() => resolve(true), 500);
				});
			}
			$this.walletWindowReference = $this.opnerWindow.open(
				'wallet',
				'Near Wallet',
				`popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,left=${
					window.screen.availWidth / 2 - 200
				},top=65,width=400,height=740`,
			) as Window;
		} catch (e: any) {
			throw new Error(
				`Wallet could not define a window document with the following error message: ${
					e?.message || 'unknown'
				}`,
			);
		}
	},

	async _watchTransactionCallback() {
		const startTime = new Date().getTime();
		let finishedTime = new Date().getTime();
		let totalExecutionTime = (finishedTime - startTime) / 1000;
		const $this = this;
		const callback = { finished: false, success: false, message: '', data: {}, finishedTime, totalExecutionTime };
		let walletRedirectAlreadyHasHappend: boolean = false;
		let stopWatchTimeout = setTimeout(() => {});
		let watchInterval = setInterval(() => {});
		const stopWatch = async (interval: NodeJS.Timeout, timeout: NodeJS.Timeout, windowRederence: Window) => {
			clearInterval(interval);
			clearTimeout(timeout);
			walletRedirectAlreadyHasHappend = true;
			if (typeof windowRederence.closed !== 'undefined' && !windowRederence.closed) {
				callback.finished = true;
				callback.finishedTime = finishedTime;
				callback.totalExecutionTime = totalExecutionTime;

				console.log('wallet will have been finished yout work , so, mwke me wait.');
				await $this._makeItWait(100);
				try {
					if ($this._verifyIfWalletWindowIsOpen()) {
						console.log('Wallet it is oppened, lets close that.');
						$this.walletWindowReference.close();
						$this._resetProps();
						console.log('Window Wallet has been stopped and closed with your execution watch.');
						$this.callbackData = callback;
						await $this._makeItWait(200);
						return;
					}
					console.log('Wallet it is not oppened :/ lets just reset this object properties.');
					$this._resetProps();
					console.log('Window Wallet has been stopped with your execution watch.');
					$this.callbackData = callback;
					await $this._makeItWait(200);
					return;
				} catch (e: any) {
					console.error(e);
					$this._resetProps();
					$this.callbackData = callback;
					await $this._makeItWait(200);
					console.log('wallet closed error: ', e);
				}
			}
		};
		let executionsCount: number = 0;
		try {
			watchInterval = setInterval(() => {
				finishedTime = new Date().getTime();
				totalExecutionTime = (finishedTime - startTime) / 1000;
				executionsCount++;

				console.log(`Wallet execution ${executionsCount}: `, $this);
				if ($this.callbackData.finished) {
					console.log(`Cannot watch already finished wallet callback.`);
					stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
					return;
				}

				// console.log({ startTime, finishedTime, totalExecutionTime });
				try {
					// 1 - Verify if wallet exist as opened window
					try {
						// If it is not opened, impossible to continue the execution of RPC transaction.
						if (!$this._verifyIfWalletWindowIsOpen()) {
							callback.finished = true;
							callback.success = false;
							callback.message = `Unexpected closed Wallet.`;
							callback.data = { walletRef: $this.walletWindowReference };
							stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
							return;
						}
					} catch (e: any) {
						callback.finished = true;
						callback.success = false;
						callback.message = `Unexpected Wallet error while verify your window open/close status.`;
						callback.data = { walletRef: $this.walletWindowReference };
						console.log({
							message: e.message,
							name: e.name,
							fileName: e.fileName,
							lineNumber: e.lineNumber,
							columnNumber: e.columnNumber,
							stack: e.stack,
						});
						stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
						return;
					}
					// 2 - Verify if exist the location and search window properties exist, if it is not, its mean that wallet window did not finish yout load yet.
					try {
						/**
						 * Verify if exist the location and search window properties exist, if it is not, its mean that wallet window did not finish yout load yet.
						 * if did not get the string type for it, then return to wait another watch execution
						 */
						if (!(typeof $this._getWalletWindow()?.location?.search === 'string')) {
							console.log('217');
							return;
						}
					} catch (e: any) {
						// 3 - If this verification catch some error, it probably means that wallet window already has been redirect to near wallet url.
						/**
						 * The code 18 means that we are trying to get crossOrigin informations, so for us, it means that user currently are in NEAR wallet url.
						 * So, if we catch this error, we should set the variable walletRedirectAlreadyHasHappend to true
						 */
						if (e?.code === 18) {
							if (walletRedirectAlreadyHasHappend) {
								console.log(
									'User still in Near Wallet management. Knowedge by code error 18 with walletRedirectAlreadyHasHappend equal to true.',
								);
								return;
							}
							walletRedirectAlreadyHasHappend = true;
							console.log(
								`User are managing your near wallet permissions. Waiting to get back to our host location.`,
							);
							return;
						}
						console.log('===== unexpected error =====');
						console.log('Error code: ', e?.code || 'no code');
						console.log('More about:');
						console.error(e instanceof SyntaxError);
						console.log({
							message: e.message,
							name: e.name,
							fileName: e.fileName,
							lineNumber: e.lineNumber,
							columnNumber: e.columnNumber,
							stack: e.stack,
						});
						console.error(e);
						console.log('===== unexpected error =====');
						stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
					}
					if (!walletRedirectAlreadyHasHappend) {
						if (executionsCount < 2) {
							console.log(`Wallet redirection could not be retrived yet.`);
							return;
						}
						const messageDorWalletWithoutNearLinkVisitHappend = `Wallet end execution could not be identifyed. That could happen when the redirect was not really nessesary. `;
						console.log(messageDorWalletWithoutNearLinkVisitHappend);
						callback.finished = true;
						callback.success = true;
						callback.message = messageDorWalletWithoutNearLinkVisitHappend;
						callback.data = { startTime, finishedTime, totalExecutionTime };
						stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
						return;
					}
					console.log($this._getWalletWindow().location);
					try {
						if (!($this._getWalletWindow().location.search.indexOf('?transactionHashes=') >= 0)) {
							callback.finished = true;
							callback.success = true;
							callback.message = `Wallet successfully finished execution.`;
							callback.data = {
								startTime,
								finishedTime,
								totalExecutionTime,
							};
							stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
							return;
						}
					} catch (e: any) {
						console.error(e);
					}
					let transactionID: string = 'NOT_FOUNDED';
					try {
						transactionID = $this
							._getWalletWindow()
							.location.search.split('?')
							.splice(1, 1)
							.join('')
							.split('&')
							.filter(
								(item, offset) =>
									item.split('=').splice(0, 1).join('').indexOf('transactionHashes') >= 0,
							)
							.map((item, offset) => item.split('=').splice(1, 1).join(''))
							.join('');
					} catch (e: any) {
						transactionID = `ERROR_WHEN_GET_TRANSACTION_VALUE: ${e?.message}` || 'unknown';
						console.error(e);
					}

					callback.finished = true;
					callback.success = true;
					callback.message = `Wallet successfully received transation.`;
					callback.data = {
						transaction: { id: transactionID },
						startTime,
						finishedTime,
						totalExecutionTime,
					};
					stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
					return;
				} catch (e: any) {
					console.error(e);
				}
			}, 2000);

			stopWatchTimeout = setTimeout(() => {
				const finishedTime = new Date().getTime();
				const totalExecutionTime = (finishedTime - startTime) / 1000;
				callback.finished = true;
				callback.success = false;
				callback.message = `Wallet timeout for transation callback.`;
				callback.data = { startTime, finishedTime, totalExecutionTime };
				stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
				stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
			}, 600000);
		} catch (e: any) {
			console.error(e);
			const finishedTime = new Date().getTime();
			const totalExecutionTime = (finishedTime - startTime) / 1000;
			callback.finished = true;
			callback.success = false;
			callback.message = `Wallet error for callback execution.`;
			callback.data = {
				error: e.message || 'unknown error message.',
				startTime,
				finishedTime,
				totalExecutionTime,
			};
			stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
			stopWatch(watchInterval, stopWatchTimeout, $this.walletWindowReference);
		}
	},

	_getOpnerWindow() {
		return this.opnerWindow;
	},

	_getWalletWindow(): IWalletWindowReference {
		return this.walletWindowReference.window as IWalletWindowReference;
	},

	_verifyIfWalletWindowIsOpen(): boolean {
		const $this = this;
		try {
			if (typeof $this.walletWindowReference.closed === 'undefined') {
				return false;
			}
			return !$this.walletWindowReference.closed;
		} catch (e: any) {
			console.error(e);
			return false;
		}
	},
	async _makeItWait(msTime: number = 500): Promise<void> {
		await new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(true);
			}, msTime);
		});
	},
};
