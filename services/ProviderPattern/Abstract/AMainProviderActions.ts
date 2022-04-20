import GenericProviderActions from '@ProviderPattern/models/Actions/AbstractGenericActions';
import AbstractMainProviderActions from '@ProviderPattern/models/Actions/AbstractMainProviderActions';

export abstract class AProviderActionsManager extends GenericProviderActions {
	/**
	 * This is the instance reference as singleton when requested
	 */
	protected static _singletonHandler: AProviderActionsManager;

	static {
		this.getInstance = <T = InstanceType<typeof AProviderActionsManager>>(): T => {
			const $this = this.getInstance(this._singletonHandler as unknown as AbstractMainProviderActions);
			return $this as unknown as T;
		};
	}
}
