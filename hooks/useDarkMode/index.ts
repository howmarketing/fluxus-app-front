import { useContext } from 'react';
import { DarkModeContext, IDarkModeContext } from 'contexts/darkMode';

const useDarkMode = function (): IDarkModeContext {
	return useContext(DarkModeContext);
};

export default useDarkMode;
