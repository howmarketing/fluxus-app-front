/* eslint @typescript-eslint/no-empty-interface: "off" */
import 'styled-components';
import theme from './theme';

/**
 * THEME COLORS PROPS
 * @description The colors props to be defined as theme
 * @property {string} text_primary
 * @property {string} text_secundary
 * @property {string} primary_green
 * @property {string} grey
 * @property {string} light_grey
 * @property {string} dark_grey
 * @property {string} success
 * @property {string} tertiary_success_message
 * @property {string} seconday_pink
 * @property {string} secondary_light_purple
 * @property {string} tertiary_dark_purple
 * @property {string} tertiary_error_message
 * @property {string} primary
 * @property {string} secundary
 * @property {string} background_primary
 * @property {string} background_secundary
 * @property {string} text
 * @property {string} text_shadow
 * @property {string} box_shadow
 * @property {string} box_shadow_green
 */
export type IColors = {
	text_primary: string;
	text_secundary: string;
	primary_green: string;
	grey: string;
	light_grey: string;
	dark_grey: string;
	success: string;
	tertiary_success_message: string;
	seconday_pink: string;
	secondary_light_purple: string;
	tertiary_dark_purple: string;
	tertiary_error_message: string;
	primary: string;
	secundary: string;
	background_primary: string;
	background_secundary: string;
	text: string;
	text_shadow: string;
	box_shadow: string;
	box_shadow_green: string;
};

export type ITheme = {
	title: string;
	colors: IColors;
};

export type Theme = ITheme;

declare module 'styled-components' {
	export interface DefaultTheme extends Theme {
		title: string;
		colors: IColors;
	}
}
