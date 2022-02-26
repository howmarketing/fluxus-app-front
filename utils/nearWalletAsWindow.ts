/* eslint-disable no-undef */
import { INearRPCContext } from '@contexts/nearData/nearRPCData';
import ProviderPattern from '@services/ProviderPattern';
import { number } from 'mathjs';
import { makeWait } from './returns';

export type IWalletWindowReference = Window &
	typeof globalThis & { nearRPC: INearRPCContext | any; providerPattern: ProviderPattern | any };
export type IWalletAsWindowErrorType = { success: boolean; message: string; extra: any };
export type ICallbackData = {
	finished: boolean;
	success: boolean;
	message: string;
	data: Record<any, any>;
	finishedTime: number;
	totalExecutionTime: number;
	executionsCount: number;
};

export type IWalletWindowProvider = INearRPCContext | ProviderPattern;
export const nearWalletAsWindow = {
	opnerWindow: {} as Window,
	walletWindowReference: {} as Window,
	callbackData: {} as ICallbackData,
	_makeItWaitBeforeClose: 2000 as number,
	debug: true,

	async getWindowWalletRPC<T extends unknown>(
		returnRPCFromProviderPattern = false,
		canRetry = true,
		closeWhenFinished = true,
	): Promise<T> {
		const $this = this;
		try {
			const providerKey = `${returnRPCFromProviderPattern ? 'providerPattern' : 'nearRPC'}`;
			const setupRersponse = await $this._setUp(closeWhenFinished);
			if (!setupRersponse.success) {
				if (canRetry) {
					return nearWalletAsWindow.getWindowWalletRPC<T>(
						returnRPCFromProviderPattern,
						false,
						closeWhenFinished,
					);
				}
				throw new Error(setupRersponse.message);
			}
			let walletWindowDOM: IWalletWindowReference;
			try {
				walletWindowDOM = $this._getWalletWindow();
				if (typeof $this.walletWindowReference === 'undefined' || $this.walletWindowReference === null) {
					if (canRetry) {
						return nearWalletAsWindow.getWindowWalletRPC<T>(
							returnRPCFromProviderPattern,
							false,
							closeWhenFinished,
						);
					}
					throw new Error('walletWindowReference is undefined');
				}
				if (typeof walletWindowDOM === 'undefined' || walletWindowDOM === null) {
					if (canRetry) {
						return nearWalletAsWindow.getWindowWalletRPC<T>(
							returnRPCFromProviderPattern,
							false,
							closeWhenFinished,
						);
					}
					throw new Error('walletWindowDOM is undefined');
				}
				walletWindowDOM.focus();
			} catch (e: any) {
				if (canRetry) {
					return nearWalletAsWindow.getWindowWalletRPC<T>(
						returnRPCFromProviderPattern,
						false,
						closeWhenFinished,
					);
				}
				throw new Error(`Get wallet window error: ${e?.message || 'unknown error'}`);
			}
			const rpcProvider = await new Promise<T | undefined>((resolve, reject) => {
				const rpcTimeout = setTimeout(() => {
					resolve(undefined);
				}, 15000);
				const loadingNearPresets = setInterval(() => {
					if (typeof walletWindowDOM[providerKey] !== 'undefined') {
						try {
							if ('providerPattern' in walletWindowDOM && 'nearRPC' in walletWindowDOM) {
								if (providerKey === 'nearRPC') {
									clearTimeout(rpcTimeout);
									clearInterval(loadingNearPresets);
									resolve(walletWindowDOM.nearRPC);
								} else {
									clearTimeout(rpcTimeout);
									clearInterval(loadingNearPresets);
									resolve(walletWindowDOM.providerPattern);
								}
								return;
							}
							console.log({ key: providerKey, walletProvided: walletWindowDOM[providerKey] });
							resolve(providerKey === 'nearRPC' ? walletWindowDOM.nearRPC : walletWindowDOM[providerKey]);
						} catch (e: any) {
							console.log(e);
						}
					}
				}, 500);
			});
			// important to debug what provider are been available
			if (this.debug) {
				console.log('Provider key resolved for: ', providerKey);
				console.log(rpcProvider);
				console.log('walletWindowDOM: ', walletWindowDOM);
			}

			if (typeof rpcProvider === 'undefined') {
				try {
					if ($this._verifyIfWalletWindowIsOpen() && closeWhenFinished) {
						walletWindowDOM.close(); // close window
					}
				} catch (e: any) {
					throw new Error(`Failed to close the window`);
				}
				throw new Error(`Wallet get timed out while try to get NEAR RPC Provider. `);
			}
			$this._watchTransactionCallback(closeWhenFinished);
			return rpcProvider;
		} catch (e: any) {
			throw new Error(`${e?.message || 'Unknown error'}`);
		}
	},

	async getWalletCallback($limitCallbackTimeout: number | undefined = 360000) {
		const $this = this as IWalletAsWindow;
		$limitCallbackTimeout = $limitCallbackTimeout || 360000;
		$limitCallbackTimeout = $limitCallbackTimeout < 20000 ? 20000 : $limitCallbackTimeout;
		$limitCallbackTimeout = $limitCallbackTimeout > 360000 ? 360000 : $limitCallbackTimeout;
		try {
			const walletHasNoTimedOut = await new Promise((resolve, reject) => {
				let timeout = setTimeout(() => {});
				const interval = setInterval(() => {
					if ($this.debug) {
						console.log('wallet waiting callback.');
					}
					if ($this.callbackData.finished) {
						clearInterval(interval);
						clearTimeout(timeout);
						resolve(true);
					}
				}, 300);
				timeout = setTimeout(() => {
					clearInterval(interval);
					clearTimeout(timeout);
					resolve(false);
				}, $limitCallbackTimeout);
			});
			if (!walletHasNoTimedOut) {
				$this.callbackData.finished = true;
				$this.callbackData.success = false;
				$this.callbackData.message = `Wallet has timed out to get callback. Callback current message: ${$this.callbackData.message}`;
			}
			return $this.callbackData;
		} catch (e: any) {
			$this.callbackData.finished = true;
			$this.callbackData.message = `Error for implementation to get wallet callback: ${
				e?.message || 'Unknown error'
			}. Callback current message: ${$this.callbackData.message}`;
			return $this.callbackData;
		}
	},

	async _setUp(closeWhenFinished = true) {
		const $this = this;
		try {
			await $this._resetProps(closeWhenFinished);
			await $this._defineOpnerWindow();
			await $this._defineWalletWindow(closeWhenFinished);
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

	async _resetProps(closeWhenFinished = true) {
		const $this = this;
		try {
			$this.callbackData = {
				finished: false,
				success: false,
				message: '',
				data: {},
				finishedTime: 0,
				totalExecutionTime: 0,
				executionsCount: 0,
			} as ICallbackData;
			// $this._makeItWaitBeforeClose = 800;
			$this.opnerWindow = {} as Window;
			$this.walletWindowReference =
				closeWhenFinished || typeof $this.walletWindowReference.closed === 'undefined'
					? ({} as Window)
					: $this.walletWindowReference;

			try {
				if ($this._verifyIfWalletWindowIsOpen()) {
					if (!closeWhenFinished) {
						$this.opnerWindow?.focus();
					}
					if (closeWhenFinished) {
						$this.walletWindowReference?.focus();
						$this.walletWindowReference?.close(); // close window
					}
				}
				await $this._defineOpnerWindow();
			} catch (e: any) {
				$this.callbackData.message = e?.message || 'unknown for close at reset pros.';
			}
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

	async _defineWalletWindow(closeWhenFinished = true) {
		const $this = this;
		try {
			if (!$this._verifyIfWalletWindowIsOpen()) {
				await $this._resetProps(closeWhenFinished);
				await new Promise<boolean>((resolve, reject) => {
					setTimeout(() => resolve(true), 3500);
				});
			}
			const windowDimensions = {
				width: 480,
				height: 755,
				top: 288,
				left: Number(window.screen.availWidth) - 548,
			};
			$this.walletWindowReference = $this.opnerWindow.open(
				'wallet',
				'Near Wallet',
				`popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,left=${windowDimensions.left},top=${windowDimensions.top},width=${windowDimensions.width},height=${windowDimensions.height}`,
			) as Window;
			await makeWait(2000);
		} catch (e: any) {
			throw new Error(
				`Wallet could not define a window document with the following error message: ${
					e?.message || 'unknown'
				}`,
			);
		}
	},

	async _watchTransactionCallback(closeWhenFinished = true) {
		const startTime = new Date().getTime();
		let finishedTime = new Date().getTime();
		let totalExecutionTime = (finishedTime - startTime) / 1000;
		const $this = this as typeof nearWalletAsWindow;
		const callback = {
			finished: false,
			success: false,
			message: '',
			data: {} as Record<any, any>,
			finishedTime,
			totalExecutionTime,
			executionsCount: 0 as number,
		};
		let walletRedirectAlreadyHasHappened: boolean = false;
		let stopWatchTimeout = setTimeout(() => {});
		let watchInterval = setInterval(() => {});
		let executionsCount: number = 0;
		const stopWatch = async (interval: NodeJS.Timeout, timeout: NodeJS.Timeout) => {
			clearInterval(interval);
			clearTimeout(timeout);
			walletRedirectAlreadyHasHappened = true;
			callback.finished = true;
			callback.finishedTime = finishedTime;
			callback.totalExecutionTime = totalExecutionTime;
			callback.executionsCount = executionsCount;

			if ($this.debug) {
				console.log(
					`wallet may have been finished your work , so, make me wait ${$this._makeItWaitBeforeClose} before close.`,
				);
			}
			await $this._makeItWait($this._makeItWaitBeforeClose);
			const windowIsOpen = $this._verifyIfWalletWindowIsOpen();
			if ($this.debug) {
				console.log(`Wallet it is ${!windowIsOpen ? '' : 'not'}oppened, lets close that.`);
			}
			try {
				// If wallet is open and can be closed at the end of the transaction, close it immediately
				if ($this.debug) {
					console.log({ windowIsOpen, closeWhenFinished });
				}
				if (windowIsOpen && closeWhenFinished) {
					$this.walletWindowReference.close(); // close window
				}
			} catch (e: any) {
				console.error(e);
				if ($this.debug) {
					console.log('wallet closed error: ', e);
				}
			}
			await $this._makeItWait(200);
			$this.callbackData = callback;
			await $this._makeItWait(800);
			$this._resetProps(closeWhenFinished);
		};

		try {
			watchInterval = setInterval(() => {
				finishedTime = new Date().getTime();
				totalExecutionTime = (finishedTime - startTime) / 1000;
				executionsCount++;

				if ($this.debug) {
					console.log(`Wallet execution ${executionsCount}: `, $this);
				}
				if ($this.callbackData.finished) {
					if ($this.debug) {
						console.log(`Cannot watch already finished wallet callback.`);
					}
					stopWatch(watchInterval, stopWatchTimeout);
					return;
				}
				try {
					// 1 - Verify if wallet exist as opened window
					try {
						// If it is not opened, impossible to continue the execution of RPC transaction.
						if (!$this._verifyIfWalletWindowIsOpen()) {
							callback.finished = true;
							callback.success = false;
							callback.message = `Unexpected closed Wallet.`;
							callback.data = { walletRef: $this.walletWindowReference };
							stopWatch(watchInterval, stopWatchTimeout);
							return;
						}
					} catch (e: any) {
						callback.finished = true;
						callback.success = false;
						callback.message = `Unexpected Wallet error while verify your window open/close status.`;
						callback.data = { walletRef: $this.walletWindowReference };
						if ($this.debug) {
							console.log({
								message: e.message,
								name: e.name,
								fileName: e.fileName,
								lineNumber: e.lineNumber,
								columnNumber: e.columnNumber,
								stack: e.stack,
							});
						}
						stopWatch(watchInterval, stopWatchTimeout);
						return;
					}
					// 2 - Verify if exist the location and search window properties exist, if it is not, its mean that wallet window did not finish yout load yet.
					try {
						/**
						 * Verify if exist the location and search window properties exist, if it is not, its mean that wallet window did not finish yout load yet.
						 * if did not get the string type for it, then return to wait another watch execution
						 */
						if (!(typeof $this._getWalletWindow()?.location?.search === 'string')) {
							if ($this.debug) {
								console.log('LINE: 381');
							}
							return;
						}
					} catch (e: any) {
						// 3 - If this verification catch some error, it probably means that wallet window already has been redirect to near wallet url.
						/**
						 * The code 18 means that we are trying to get crossOrigin informations, so for us, it means that user currently are in NEAR wallet url.
						 * So, if we catch this error, we should set the variable walletRedirectAlreadyHasHappened to true
						 */
						if (e?.code === 18) {
							if (walletRedirectAlreadyHasHappened) {
								if ($this.debug) {
									console.log(
										'User still in Near Wallet management. Knowedge by code error 18 with walletRedirectAlreadyHasHappened equal to true.',
									);
								}
								return;
							}
							walletRedirectAlreadyHasHappened = true;
							if ($this.debug) {
								console.log(
									`User are managing your near wallet permissions. Waiting to get back to our host location.`,
								);
							}
							return;
						}
						if ($this.debug) {
							console.log('===== unexpected error =====');
							console.log('Error code: ', e?.code || 'no code');
							console.log('More about:');
						}
						console.error(e instanceof SyntaxError);
						if ($this.debug) {
							console.log({
								message: e.message,
								name: e.name,
								fileName: e.fileName,
								lineNumber: e.lineNumber,
								columnNumber: e.columnNumber,
								stack: e.stack,
							});
						}
						console.error(e);
						if ($this.debug) {
							console.log('===== unexpected error =====');
						}
						stopWatch(watchInterval, stopWatchTimeout);
					}

					if (!walletRedirectAlreadyHasHappened) {
						if (executionsCount < 8) {
							if ($this.debug) {
								console.log(`Wallet redirection could not be retrived yet.`);
							}
							return;
						}
						const messageDorWalletWithoutNearLinkVisitHappend = `Wallet end execution could not be identifyed. That could happen when the redirect was not really nessesary. `;
						if ($this.debug) {
							console.log(messageDorWalletWithoutNearLinkVisitHappend);
						}
						callback.finished = true;
						callback.success = true;
						callback.message = messageDorWalletWithoutNearLinkVisitHappend;
						callback.data = {};
						stopWatch(watchInterval, stopWatchTimeout);
						return;
					}
					if ($this.debug) {
						console.log($this._getWalletWindow().location);
					}
					try {
						if (!($this._getWalletWindow().location.search.indexOf('?transactionHashes=') >= 0)) {
							callback.finished = true;
							callback.success = true;
							callback.message = `Wallet successfully finished execution.`;
							callback.data = { executionsCount };
							stopWatch(watchInterval, stopWatchTimeout);
							return;
						}
					} catch (e: any) {
						console.error(e);
					}
					let transactionID: string = 'NOT_FOUNDED';
					callback.finished = true;
					callback.success = true;
					callback.message = `Wallet successfully received transation.`;
					callback.data = {
						transaction: { id: transactionID },
						executionsCount,
					};
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
						callback.data.transaction = { id: transactionID, executionsCount };
					} catch (e: any) {
						transactionID = `ERROR_WHEN_GET_TRANSACTION_VALUE: ${e?.message}` || 'unknown';
						callback.data.transaction = { id: transactionID, executionsCount };
						console.error(e);
					}

					stopWatch(watchInterval, stopWatchTimeout);
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
				stopWatch(watchInterval, stopWatchTimeout);
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
			stopWatch(watchInterval, stopWatchTimeout);
		}
	},

	_getOpnerWindow() {
		return this.opnerWindow;
	},

	_getWalletWindow(): IWalletWindowReference {
		return (this?.walletWindowReference?.window as IWalletWindowReference) || {};
	},

	_verifyIfWalletWindowIsOpen(): boolean {
		const $this = this as typeof nearWalletAsWindow;
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
export type IWalletAsWindow = typeof nearWalletAsWindow;
