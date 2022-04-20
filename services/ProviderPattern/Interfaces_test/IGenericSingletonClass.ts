// TODO Implement after Abstract been created
import { IAny } from '@ProviderPattern/Interfaces_test';
import { AGenericSingleton } from '../Abstract';
// import { AGenericSingleton } from '../Abstract';

/**
 * ### Class interface for attributes infer implements requires
 *  * @example
 *
 * ```typescript
 *    //example of how to use this infer type
 * 		type IGenericSingletonReturnOverrideAttr<T> = T & IGenericSingletonAttr<IGenericSingletonAttr<T>>;
 * ```
 *
 * @description
 * The example marker was an real implemented example as following down to the next infer type
 */
export interface IGenericSingletonAttr<T> {
	_singletonHandler: T;
	setUp: ($args?: any) => void;
}

/**
 * // TODO Reference for "AGenericSingleton" will be placed when Abstract has been implemented
 *
 * #### Type return accessor infer own interface
 *
 * @name IGenericSingletonReturnOverrideAttr
 *
 * @example
 * ```typescript
 * 		//	This is an public class method accessor initialization of the singleton instance of class
 *		public static getInstance<T>(): T {
 *			type IAttr = IGenericSingletonReturnOverrideAttr<T>;
 *			const $this: IAttr = this as unknown as IAttr;
 *			return this.getInstanceSingleton<T>($this);
 *		}
 * ```
 *
 * @memberof AGenericSingleton
 */
export type IGenericSingletonReturnOverrideAttr<T> = T & IGenericSingletonAttr<IGenericSingletonAttr<T>>;

/**
 * //TODO Reference for "AGenericSingleton" will be placed when Abstract has been implemented
 *
 * #### Type return accessor infer own interface
 *
 * @name IGenericSingletonClass
 *
 * @example	-----------------
 *
 * ```typescript
 *		@inner
 * 		//	This is an public class method accessor initialization of the singleton instance of class
 * 		@type { MainProviderConfigModel }
 * 		@name _singletonHandler Provider connection config property dependency implementation with default value }
 * 		@property {IGenericSingletonClass<IGenericSingletonReturnOverrideAttr<T>>} _singletonHandler }
 * 		@memberof MainProviderConfigModel
 * 		protected static _singletonHandler: IGenericSingletonClass<MainProviderConfigModel>;
 * ```
 *
 * @memberof AGenericSingleton
 */
export interface IGenericSingletonClass<T> extends AGenericSingleton {
	new (): IGenericSingletonAttr<T>;
	// _singletonHandler: IGenericSingletonClass<T>;
	// setUp?: (args?: any) => void;
}
