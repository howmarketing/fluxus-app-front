import React, { ImgHTMLAttributes } from 'react';
import styled from 'styled-components';

export type IImg = ImgHTMLAttributes<HTMLImageElement>;

export const ImgLogo = styled.img<IImg>`
	max-width: 100%;
	width: 167px;
`;
