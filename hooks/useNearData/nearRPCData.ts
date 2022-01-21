import { useContext } from 'react';
import { nearRPCContext } from 'contexts';

export function useNearRPCContext() {
	return useContext(nearRPCContext);
}
