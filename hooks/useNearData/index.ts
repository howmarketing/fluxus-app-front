import { useContext } from 'react';
import { NearDataContext } from 'contexts';

export function useNearData() {
	return useContext(NearDataContext);
}
