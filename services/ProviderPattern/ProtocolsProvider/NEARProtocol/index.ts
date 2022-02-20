import { PROTOCOLS } from '@ProviderPattern/constants';
import AbstractMainProvider from '@ProviderPattern/models/AbstractMainProvider';

export default class NEARProtocolProvider extends AbstractMainProvider {
	protected static _classInstanceSingleton: NEARProtocolProvider | undefined;

	private constructor() {
		super();
		this.protocolName = PROTOCOLS.NEAR;
	}

	public static getInstance(): NEARProtocolProvider {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp();
		return this._classInstanceSingleton;
	}
}
