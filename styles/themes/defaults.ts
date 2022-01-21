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

/**
 * THEME COLORS
 * @description The defined theme colors
 */
export const colors: IColors = {} as IColors;
colors.text_primary = '#00f5cc';
colors.text_secundary = '#431286';
colors.primary_green = '#00f5cc';
colors.grey = '#656576';
colors.light_grey = '#d5d5d8';
colors.dark_grey = '#363636';
colors.success = `#0CDB50`;
colors.tertiary_success_message = `#0CDB50`;
colors.seconday_pink = `#F43085`;
colors.secondary_light_purple = `#7623F5`;
colors.tertiary_dark_purple = `#5616D4`;
colors.tertiary_error_message = `#FF002A`;
colors.primary = '#FFF';
colors.secundary = '#7623F5';
colors.background_primary = '#f1f1f1';
colors.background_secundary = '#FFFFFF';
colors.text = '#f9f8fa';
colors.text_shadow = 'rgba(0,0,0,0.08)';
colors.box_shadow = 'rgba(0, 0, 0, 0.25)';
colors.box_shadow_green = 'rgba(33, 208, 179, 0.4)';

export const colorsAsDark: IColors = JSON.parse(JSON.stringify(colors));
colorsAsDark.primary = '#101010';
colorsAsDark.background_primary = `#100317`;
colorsAsDark.background_secundary = '#1d0728';
colorsAsDark.text = '#f9f8fa';

export type ITheme = {
	title: string;
	colors: IColors;
};

export type IThemes = {
	title: string;
	colors: { light: IColors; dark: IColors };
};

export const defaults: IThemes = {
	title: 'DEFAULTS',
	colors: { light: colors, dark: colorsAsDark },
};
