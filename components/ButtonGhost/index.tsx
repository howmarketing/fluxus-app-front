/* eslint-disable arrow-body-style */
import React, { useEffect } from 'react';
import { useDarkMode } from 'hooks';
import { ButtonGhostStyled, ButtonGhostStyledAsDark, IButton } from './style';
// .
export const ButtonGhost = (props: IButton) => {
	const { theme } = useDarkMode();
	type IButtonStyled = IButton & { theme: 'DARK' | 'LIGHT' };
	const ButtonStyled: React.FC<IButtonStyled> = ({ theme = 'DARK', ...ButtonProps }) => {
		return (
			<>
				{(theme === 'DARK' && (
					<ButtonGhostStyledAsDark
						{...ButtonProps}
						onClick={ButtonProps?.onClick ? ButtonProps.onClick : ev => {}}>
						{ButtonProps?.children || ' - '}
					</ButtonGhostStyledAsDark>
				)) || (
					<ButtonGhostStyled {...ButtonProps} onClick={ButtonProps?.onClick ? ButtonProps.onClick : ev => {}}>
						{ButtonProps?.children || ' - '}
					</ButtonGhostStyled>
				)}
			</>
		);
	};
	return <ButtonStyled theme={theme.title === 'DARK' ? 'DARK' : 'LIGHT'} {...props} />;
};
export default ButtonGhost;
