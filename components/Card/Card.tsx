/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PropsWithChildren } from 'react';

export type ICardProps = PropsWithChildren<{ className?: string }> &
	React.HTMLAttributes<HTMLDivElement> & {
		width?: string;
		padding?: string | number;
		bgcolor?: string;
		rounded?: string;
	};
export const Card = function (props: ICardProps) {
	const { width, padding, bgcolor, rounded } = props;

	return (
		<div
			{...props}
			className={`${bgcolor || 'bg-cardBg'} ${rounded || 'rounded-2xl'} ${padding || 'p-6'} ${width || 'w-1/4'} ${
				props.className
			} md:rounded-lg xs:rounded-lg`}>
			{props?.children || ''}
		</div>
	);
};
