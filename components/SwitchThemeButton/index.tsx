/* eslint-disable @next/next/no-img-element */
import React from 'react';
import useDarkMode from '@hooks/useDarkMode';
import ButtonBlind from '@components/ButtonBlind';
import SwitcherThemeIconPurpleLight from '@assets/app/switcher-theme-purple-light.svg';
import SwitcherThemeIconPurple from '@assets/app/switcher-theme-purple.svg';

/**
 * APPLY THE APP COLORS THEME FROM USER SYSTEM PREFERS
 * @description This logic to discover and apply the user system prefers color scheme will be a useHook
 */
export function applySystemPrefersColorSchemeToTheme(setThemeContextFunction: (themeName: 'LIGHT' | 'DARK') => void) {
	/**
	 * KEYNAME TO STORAGE THE USER PREFER COLOR SCHEME
	 */
	const USER_SYSTEM_PREFERS_COLOR_SCHEME = '@userSystemPrefersColorScheme';

	/**
	 * APPLY THE THEME COLOR SCHEME FROM USER PREFER COLOR SCHEME SETTED FROM YOUR O.S.
	 * @description This function is used to fill matchMedia listener callback, becouse of this, we do have a redundancy to discover user prefers color scheme by matchMedia.
	 * @param { MediaQueryListEvent | any } ev
	 */
	const changeThemeByUserSystemPrefersColorScheme = (ev: MediaQueryListEvent) => {
		const systemPrefersColorScheme: MediaQueryList = window?.matchMedia('(prefers-color-scheme: dark)');
		setThemeContextFunction(systemPrefersColorScheme?.matches ? 'DARK' : 'LIGHT');
	};

	try {
		/**
		 * MATCH MEDIA RESULT FOR USER SYSTEM PREFERS COLOR SCHEME
		 */
		const userSystemPrefersColorScheme: MediaQueryList = window?.matchMedia('(prefers-color-scheme: dark)');

		/**
		 * THE MATCHED USER COLOR SCHEME
		 */
		const userColorScheme = userSystemPrefersColorScheme?.matches ? 'DARK' : 'LIGHT';

		/**
		 * ADD THE LISTENER FUNCTION TO STAY CHANGING THE THEME WHEN USER`S CHANGE YOUT SYSTEM PREFERS COLOR SCHEME
		 */
		userSystemPrefersColorScheme?.addEventListener('change', changeThemeByUserSystemPrefersColorScheme, false);

		/**
		 * IF AVAILABLE, GET THE USER LOCAL STORAGE
		 */
		const userStorage = window?.localStorage;
		/**
		 * IF USER LOCAL STORAGE IS AVAILABLE, VERIFY IF YOUR PREFERS ARE ALREADY SETTED
		 */
		if (userStorage) {
			const userStoradedPrefersColorScheme = userStorage.getItem(USER_SYSTEM_PREFERS_COLOR_SCHEME);
			/**
			 * IF USER PREFERS IT IS NOT SETTED YET, USE THE CONTEXT FUNCTION TO APPLY THAT THEME
			 */
			if (!userStoradedPrefersColorScheme) {
				userStorage.setItem(USER_SYSTEM_PREFERS_COLOR_SCHEME, userColorScheme);
				setThemeContextFunction(userColorScheme);
				return;
			}
			/**
			 * IF USER PREFERS IS ALREADY SETTED, DO NOTHING! EVEN IF THE CURRENT SETTED SCHEME DID NOT MATCH WITH USER PREFERS
			 * BECOUSE, IF IT IS NOT MATCHING, COULD MEAN THAT THE USER MANUALLY CHANGE THE APP THEME
			 */
			console.log({ user_scheme_already_setted: userStoradedPrefersColorScheme });
		}
	} catch (e: any) {
		// Error log
		console.log({
			'applySystemPrefersColorSchemeToTheme(ERROR): ':
				e?.message || 'Unknow error when try to set correspondent user system scheme to the application theme.',
		});
	}
}

const SwitchThemeButton: React.FC = ({ ...props }) => {
	const { theme, toggleTheme } = useDarkMode();
	return (
		<ButtonBlind onClick={toggleTheme}>
			<img
				src={theme.title === 'DARK' ? SwitcherThemeIconPurpleLight : SwitcherThemeIconPurple}
				title={`Fluxus Theme Switcher icon ${theme.title} logo`}
				alt={`Fluxus Theme Switcher icon ${theme.title} logo`}
			/>
		</ButtonBlind>
	);
};
export default SwitchThemeButton;
