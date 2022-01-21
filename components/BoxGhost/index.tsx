import React from 'react';
import { useDarkMode } from 'hooks';
import { BoxGhostStyled, BoxGhostStyledAsDark, IBoxGhost } from './style';
// .
export const BoxGhost = (props: IBoxGhost) => {
	const { theme } = useDarkMode();

	type IBoxGhostStyled = IBoxGhost & { themeTitle: 'DARK' | 'LIGHT' };
	const BoxStyled: React.FC<IBoxGhostStyled> = ({ themeTitle = 'DARK', ...boxProps }) =>
		themeTitle === 'DARK' ? (
			<BoxGhostStyledAsDark {...boxProps}>{boxProps?.children || ' - '}</BoxGhostStyledAsDark>
		) : (
			<BoxGhostStyled {...boxProps}>{boxProps?.children || ' - '}</BoxGhostStyled>
		);
	return <BoxStyled themeTitle={theme.title === 'DARK' ? 'DARK' : 'LIGHT'} {...props} />;
};
export default BoxGhost;
