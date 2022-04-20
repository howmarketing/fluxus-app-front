import { IGenericSingletonReturnOverrideAttr, IGenericSingletonClass } from '@ProviderPattern/Interfaces_test';
import GenericProviderActions from '../models/Actions/AbstractGenericActions';

/**
 * ### Generic abstraction pattern to singleton classes
 *
 * @export
 * @abstract
 * @class AGenericSingleton
 */
export class AGenericSingleton {
	/**
	 * Description placeholder
	 *
	 * @protected
	 * @static
	 * @type {AGenericSingleton}
	 */
	protected static _singletonHandler: AGenericSingleton;

	/**
	 * This is the public accessor initialization of the singleton instance of class
	 */
	public static getInstance<T>(setupData?: any): T {
		return this.getInstanceSingleton<GenericProviderActions>(
			this as unknown as IGenericSingletonReturnOverrideAttr<GenericProviderActions>,
		) as unknown as T;
	}

	/**
	 * This is the second layer as a cheat typescript interpreter missing up some type-checks reference when build runtime
	 */
	protected static getInstanceSingleton<T>($thisInferT: IGenericSingletonReturnOverrideAttr<T>): T {
		return this.singletonInstanceCreator<T>($thisInferT, this as unknown as IGenericSingletonClass<T>) as T;
	}

	/**
	 * This is the third layer that receive these cheat type-checks and apply the creation of the singleton logic
	 */
	public static singletonInstanceCreator<T>(
		$thisInferT: IGenericSingletonReturnOverrideAttr<T>,
		$thisInferU: IGenericSingletonClass<T>,
	): T {
		/** Check if instance already exist */
		if ($thisInferT._singletonHandler) return $thisInferT._singletonHandler as unknown as T;
		/** Store the singleton instance in the static _singletonHandler property */
		$thisInferT._singletonHandler = new $thisInferU();
		if ('setUp' in $thisInferT._singletonHandler && typeof $thisInferT._singletonHandler.setUp === 'function') {
			$thisInferT._singletonHandler.setUp();
		}
		return $thisInferT._singletonHandler as unknown as T;
	}
}
