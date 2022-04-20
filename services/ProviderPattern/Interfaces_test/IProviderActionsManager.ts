import GenericProviderActions from '@ProviderPattern/models/Actions/AbstractGenericActions';

/**
 *
 * // TODO AFTER ACTIONS BEEN IMPLEMENTED, FINISH THIS INTERFACE
 * @export
 * @interface IProviderActionsManager
 */
export interface IProviderActionsManager extends GenericProviderActions {
	/**
	 * Description placeholder
	 * @date 22/03/2022 - 11:17:09
	 * @author Ariza
	 *
	 * @param {?unknown} [data]
	 * @returns {unknown}
	 */
	getAccountActions(data?: unknown): unknown;
	/**
	 * Description placeholder
	 * @date 22/03/2022 - 11:17:09
	 * @author Ariza
	 *
	 * @param {?unknown} [data]
	 * @returns {unknown}
	 */
	getAPIActions(data?: unknown): unknown;
	/**
	 * Description placeholder
	 * @date 22/03/2022 - 11:17:09
	 * @author Ariza
	 *
	 * @param {?unknown} [data]
	 * @returns {unknown}
	 */
	getFarmActions(data?: unknown): unknown;
	/**
	 * Description placeholder
	 * @date 22/03/2022 - 11:17:09
	 * @author Ariza
	 *
	 * @param {?unknown} [data]
	 * @returns {unknown}
	 */
	getFTContractActions(data?: unknown): unknown;
	/**
	 * Description placeholder
	 * @date 22/03/2022 - 11:17:09
	 * @author Ariza
	 *
	 * @param {?unknown} [data]
	 * @returns {unknown}
	 */
	getMTokenActions(data?: unknown): unknown;
	/**
	 * Description placeholder
	 * @date 22/03/2022 - 11:17:09
	 * @author Ariza
	 *
	 * @param {?unknown} [data]
	 * @returns {unknown}
	 */
	getPoolActions(data?: unknown): unknown;
	/**
	 * Description placeholder
	 * @date 22/03/2022 - 11:17:09
	 * @author Ariza
	 *
	 * @param {?unknown} [data]
	 * @returns {unknown}
	 */
	getSwapActions(data?: unknown): unknown;
	/**
	 * Description placeholder
	 * @date 22/03/2022 - 11:17:09
	 * @author Ariza
	 *
	 * @param {?unknown} [data]
	 * @returns {unknown}
	 */
	getTokenActions(data?: unknown): unknown;
	/**
	 * Description placeholder
	 * @date 22/03/2022 - 11:17:09
	 * @author Ariza
	 *
	 * @param {?unknown} [data]
	 * @returns {unknown}
	 */
	getTransactionActions(data?: unknown): unknown;
}
