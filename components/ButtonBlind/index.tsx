import React, { useEffect } from 'react';
import { useDarkMode } from 'hooks';
import { ButtonBlindStyled, ButtonBlindStyledAsDark, IButton } from './style';

const ButtonBlind = (props: IButton) => {
	const { theme } = useDarkMode();
	type IButtonStyled = IButton & { theme: 'DARK' | 'LIGHT' };
	const ButtonStyled: React.FC<IButtonStyled> = ({ theme = 'DARK', ...ButtonProps }) => (
		<>
			{(theme === 'DARK' && (
				<ButtonBlindStyledAsDark
					{...ButtonProps}
					onClick={ButtonProps?.onClick ? ButtonProps.onClick : ev => {}}>
					{ButtonProps?.children || ' - '}
				</ButtonBlindStyledAsDark>
			)) || (
				<ButtonBlindStyled {...ButtonProps} onClick={ButtonProps?.onClick ? ButtonProps.onClick : ev => {}}>
					{ButtonProps?.children || ' - '}
				</ButtonBlindStyled>
			)}
		</>
	);
	return <ButtonStyled theme={theme.title === 'DARK' ? 'DARK' : 'LIGHT'} {...props} />;
};
export default ButtonBlind;
