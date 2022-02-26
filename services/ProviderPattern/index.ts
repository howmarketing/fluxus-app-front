import { IPROTOCOL_NAME, IPROTOCOLS, PROTOCOLS } from './constants/index';
import AbstractMainProvider from './models/AbstractMainProvider';
import MainProvider from './models/MainProvider';
import AURORAProtocolProvider from './ProtocolsProvider/AURORAProtocol';
import NEARProtocolProvider from './ProtocolsProvider/NEARProtocol';

export default class ProviderPattern {
	protected static _classInstanceSingleton: ProviderPattern;

	protected declare protocols: IPROTOCOLS;

	protected declare protocol: IPROTOCOL_NAME;

	protected declare provider: AbstractMainProvider & MainProvider;

	protected declare MAINProtocolProvider: AbstractMainProvider & MainProvider;

	protected declare NEARProtocolProvider: AbstractMainProvider & NEARProtocolProvider;

	protected declare AURORAProtocolProvider: AbstractMainProvider & AURORAProtocolProvider;

	constructor() {
		this.protocols = PROTOCOLS;
		this.MAINProtocolProvider = MainProvider.getInstance();
		this.NEARProtocolProvider = NEARProtocolProvider.getInstance();
		this.AURORAProtocolProvider = AURORAProtocolProvider.getInstance();
	}

	/**
	 * Return the singleton instance of this provider pattern class
	 * @param {IPROTOCOL_NAME} protocolName
	 */
	public static getInstance(protocolName?: IPROTOCOL_NAME): ProviderPattern {
		if (!this._classInstanceSingleton) {
			this._classInstanceSingleton = new this();
		}
		this._classInstanceSingleton.setProvider(protocolName);
		return this._classInstanceSingleton;
	}

	/**
	 * Return the singleton instance of chosed or main provider implementation class
	 * @param {IPROTOCOL_NAME} protocolName
	 */
	public static getProviderInstance(protocolName?: IPROTOCOL_NAME) {
		const providerPattern = ProviderPattern.getInstance(protocolName);
		return providerPattern.getProvider();
	}

	/**
	 *
	 */
	public getProvider() {
		if (!this.provider) {
			throw new Error(
				`Should have a defined provider until be reached to here. Please check the implementation configuration for pattern provider.`,
			);
		}
		return this.provider;
	}

	/**
	 *
	 * @param {IPROTOCOL_NAME} protocolName
	 * @returns {void}
	 */
	private setProvider(protocolName?: IPROTOCOL_NAME) {
		// if has a protocolName has been specified, for any reason the provider should be re-defined without a necessary check for the protocolName is the same as a probably existent of provider, becouse it use a singleton instance of provider.
		if (protocolName) {
			this.provider = this.getProviderInstanceByProtocolName(protocolName);
			return;
		}
		// If was not specified the protocolName and already have a defined provider, then, nothing should happen here.
		if (!protocolName && this.provider) {
			return;
		}
		// If was not specified the protocolName and hasnt a defined provider, then should define the provider as main provider;
		if (!protocolName && !this.provider) {
			this.provider = this.getMainProtocolProvider();
			return;
		}
		// Should never reach here, becouse the unexistent or existent protocolName was tested to both exist or not test case for procider set.
		this.provider = this.getMainProtocolProvider();
	}

	/**
	 * @description Return the Protocol Provider instance from the specified protocol name.
	 * @param {IPROTOCOL_NAME} protocolName
	 */
	public getProviderInstanceByProtocolName(protocolName: IPROTOCOL_NAME) {
		if (protocolName === 'NEARProtocolProvider') {
			return this.NEARProtocolProvider;
		}
		if (protocolName === 'AURORAProtocolProvider') {
			return this.AURORAProtocolProvider;
		}

		// Should never get in here. Maybe put some thow exceptions here
		return this.NEARProtocolProvider;
	}

	/**
	 * @description Return the main protocol provider, witch if a Near Protocol Provider.
	 * @returns {AbstractMainProvider}
	 */
	public getMainProtocolProvider() {
		return this.MAINProtocolProvider;
	}
}
