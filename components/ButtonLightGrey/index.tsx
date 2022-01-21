import React, { useEffect } from 'react';
import { useDarkMode } from 'hooks';
import { ButtonLightGreyStyled, ButtonLightGreyStyledAsDark, IButton } from './style';

const ButtonLightGrey = (props: IButton) => {
	const { theme } = useDarkMode();
	type IButtonStyled = IButton & { theme: 'DARK' | 'LIGHT' };
	const ButtonStyled: React.FC<IButtonStyled> = ({ theme = 'DARK', ...ButtonProps }) => (
		<>
			{(theme === 'DARK' && (
				<ButtonLightGreyStyledAsDark
					{...ButtonProps}
					onClick={ButtonProps?.onClick ? ButtonProps.onClick : ev => {}}>
					{ButtonProps?.children || ' - '}
				</ButtonLightGreyStyledAsDark>
			)) || (
				<ButtonLightGreyStyled {...ButtonProps} onClick={ButtonProps?.onClick ? ButtonProps.onClick : ev => {}}>
					{ButtonProps?.children || ' - '}
				</ButtonLightGreyStyled>
			)}
		</>
	);
	return <ButtonStyled theme={theme.title === 'DARK' ? 'DARK' : 'LIGHT'} {...props} />;
};
export default ButtonLightGrey;
