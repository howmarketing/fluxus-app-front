import { IPROTOCOL_NAME, PROTOCOLS } from '@ProviderPattern/constants';
import AbstractMainProvider from '@ProviderPattern/models/AbstractMainProvider';

export default class AURORAProtocolProvider extends AbstractMainProvider {
	public declare protocolName: IPROTOCOL_NAME;

	protected static _classInstanceSingleton: AURORAProtocolProvider | undefined;

	private constructor() {
		super();
		this.protocolName = PROTOCOLS.AURORA;
	}

	public static getInstance(): AURORAProtocolProvider {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp();
		return this._classInstanceSingleton;
	}
}
