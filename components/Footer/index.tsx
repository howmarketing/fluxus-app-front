import React from 'react';
import Link from 'next/link';

import SwitchThemeButton from '@components/SwitchThemeButton';
import LogoImage from '@components/LogoImage';
import {
	FooterStyled,
	FooterContainer,
	FooterLogoArea,
	FooterMenuLinkslist,
	FooterActionsArea,
	IFooter,
} from './style';

export const Footer: React.FC<IFooter> = ({ ...props }) => (
	<FooterStyled {...props} className="Footer">
		<FooterContainer>
			{/* <FooterLogoArea>
				<LogoImage />
			</FooterLogoArea>
			<FooterMenuLinkslist>
				<ul>
					<li className="actived">
						<Link href="/farm" scroll>
							Footer
						</Link>
					</li>
				</ul>
			</FooterMenuLinkslist>
			<FooterActionsArea>
				<SwitchThemeButton />
			</FooterActionsArea> */}
		</FooterContainer>
	</FooterStyled>
);
