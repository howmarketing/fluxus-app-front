import { PROTOCOLS } from '../constants';
import AbstractMainProvider from './AbstractMainProvider';

export default class MainProvider extends AbstractMainProvider {
	protected static _classInstanceSingleton: MainProvider | undefined;

	private constructor() {
		super();
		this.protocolName = PROTOCOLS.NEAR;
	}

	public static getInstance(): MainProvider {
		if (this._classInstanceSingleton) {
			return this._classInstanceSingleton;
		}
		this._classInstanceSingleton = new this();
		this._classInstanceSingleton.setUp();
		return this._classInstanceSingleton;
	}
}
