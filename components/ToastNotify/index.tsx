import React, { useEffect, ReactElement } from 'react';
import { useDarkMode } from 'hooks';
import { CheckRounded, CloseSharp } from '@material-ui/icons';
import { toast, ToastOptions } from 'react-toastify';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';

export type IToastFyProps = {
	theme?: string | 'LIGHT' | 'DARK' | undefined;
	Icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> | undefined;
	title?: string | undefined;
	autoClose?: number | false | undefined;
};
const ToastContent = ({ theme = 'DARK', Icon = undefined, title = 'Toasting' }: IToastFyProps) => {
	const iconStyleProps = {
		color: theme === 'LIGHT' ? '#00f58a' : '#0099ff',
		fontSize: '1.3rem',
		height: '100%',
		padding: '3px 0 0 0',
	} as React.CSSProperties;
	return (
		<>
			{Icon ? <Icon style={iconStyleProps} /> : <CheckRounded style={iconStyleProps} />}

			<span>{title || ' - '}</span>
		</>
	);
};
const ToastCloseButton = () => (
	<CloseSharp style={{ margin: '0px 0px 0px 0px', fontSize: '0.95rem', color: '#51545f' }} />
);

export const dispatchToastNotify = ({ theme = 'DARK', autoClose = 8000, ...dispatchProps }: IToastFyProps) => {
	const { Icon, title } = dispatchProps;
	toast(<ToastContent theme={theme} Icon={Icon} title={title} />, {
		position: 'top-right',
		autoClose,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		closeButton: <ToastCloseButton />,
		progressStyle: {
			background: `linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0)), linear-gradient(90deg,${
				theme === 'LIGHT' ? '#00f58a, #7623f5,' : '#00f58a, #7623f5, #f43085'
			})`,
			borderRadius: '5px',
			height: '2px',
		},
		style: {
			color: `${theme === 'LIGHT' ? '#212121' : '#d1cfe6'}`,
			fontFamily: '"Mulish", sans-serif',
			textShadow: `${theme === 'LIGHT' ? '2px 1px 3px rgba(0, 0, 0, 0.1)' : '3px 1px 3px #000'}`,
			fontWeight: '700',
			fontSize: '0.85rem',
			backgroundColor: `${theme === 'LIGHT' ? '#FFFFFF' : '#000000'}`,
			boxShadow: '0px 0px 10px 10px rgba(0, 0, 0, 0.25)',
			borderRadius: '5px',
			border: '1px solid #a100f4bd',
			borderBottom: 'none',
			zIndex: '999999999',
		},
	});
};

export const ToastNotify = (props: IToastFyProps) => {
	const { theme, Icon, title, autoClose } = props;
	useEffect(() => {
		const DOMLoaded = true;
		(async () => {
			if (DOMLoaded) {
				setTimeout(() => {
					dispatchToastNotify({ theme, Icon, title, autoClose });
				}, 100);
			}
		})();
	}, []);

	return <></>;
};
export default ToastNotify;
