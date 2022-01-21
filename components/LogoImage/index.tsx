/* eslint-disable @next/next/no-img-element */
import React from 'react';
import useDarkMode from '@hooks/useDarkMode';
import LogoWhiteSvg from '@assets/app/logo-white.svg';
import LogoDarkSvg from '@assets/app/logo-dark-purple.svg';
// import { ImgLogo } from './style';

const LogoImage: React.FC = ({ ...props }) => {
	const { theme } = useDarkMode();
	return (
		<img
			src={theme.title === 'DARK' ? LogoWhiteSvg : LogoDarkSvg}
			title={`Fluxus Finance ${theme.title} logo`}
			alt={`Fluxus Finance  ${theme.title} logo`}
			style={{ maxWidth: '100%', width: '160px' }}
		/>
	);
};
export default LogoImage;
