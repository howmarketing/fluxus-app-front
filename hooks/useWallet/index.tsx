import { useContext } from 'react';
import { WalletContext } from 'contexts';

export function useWallet() {
	return useContext(WalletContext);
}
