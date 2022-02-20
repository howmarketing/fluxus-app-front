/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import { useDarkMode } from 'hooks';
import { ButtonPrimaryStyled, ButtonPrimaryStyledAsDark, IButton } from './style';

const ButtonPrimary = (props: IButton) => {
	const { theme } = useDarkMode();
	type IButtonStyled = IButton & { theme: 'DARK' | 'LIGHT' };

	const ButtonStyled: React.FC<IButtonStyled> = ({ theme = 'DARK', ...ButtonProps }) => (
		<>
			{(theme === 'DARK' && (
				<ButtonPrimaryStyledAsDark {...props}>{ButtonProps?.children || ' - '}</ButtonPrimaryStyledAsDark>
			)) || (
				<ButtonPrimaryStyled {...props} onClick={ButtonProps?.onClick ? ButtonProps.onClick : ev => {}}>
					{ButtonProps?.children || ' - '}
				</ButtonPrimaryStyled>
			)}
		</>
	);
	return (
		<ButtonStyled
			theme={theme.title === 'DARK' ? 'DARK' : 'LIGHT'}
			{...props}
			onClick={props?.onClick ? props.onClick : ev => {}}
		/>
	);
};
export default ButtonPrimary;
