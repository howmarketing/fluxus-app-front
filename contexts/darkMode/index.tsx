/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { createContext, useEffect, useState, ReactElement, useMemo } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { usePersistedState } from 'hooks';
import { KEY_LOCAL_STORAGE_THEME } from 'consts';
import { WalletProvider } from '@contexts/useWallet/index';
import { NearDataProvider } from '@contexts/nearData';

import { dark, light } from 'styles/themes';
import 'react-toastify/dist/ReactToastify.css';

export type IDarkModeContext = {
	toggleTheme: () => void;
	theme: DefaultTheme;
	setTheme: (prefferTheme: 'LIGHT' | 'DARK') => void;
	modal: {
		modalProps: IModalProps;
		setModalProps: React.Dispatch<React.SetStateAction<IModalProps>>;
	};
};

export const DarkModeContext = createContext<IDarkModeContext>({} as IDarkModeContext);

export const DarkModeProvider: React.FC = function ({ children }) {
	const [theme, setThemeState] = usePersistedState<DefaultTheme>(KEY_LOCAL_STORAGE_THEME, dark);
	const [modalProps, setModalProps] = useState<IModalProps>({} as IModalProps);
	const setTheme = (prefferTheme: 'LIGHT' | 'DARK') => {
		setThemeState(prefferTheme === 'LIGHT' ? light : dark);
	};
	const toggleTheme = () => {
		setTheme(theme?.title === 'LIGHT' ? 'DARK' : 'LIGHT');
	};
	const MemoValue = useMemo(
		() => ({
			toggleTheme,
			theme,
			setTheme,
			modal: { modalProps, setModalProps },
		}),
		[],
	);
	return (
		// eslint-disable-next-line react/jsx-no-constructed-context-values
		<DarkModeContext.Provider
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{ toggleTheme, theme, setTheme, modal: { modalProps, setModalProps } }}>
			<ThemeProvider theme={theme}>
				<WalletProvider>
					<NearDataProvider>
						<ToastContainer
							position="top-right"
							autoClose={18000}
							hideProgressBar={false}
							newestOnTop
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							style={{ zIndex: '999999999999' }}
						/>
						<Modal
							header={modalProps?.header || undefined}
							content={modalProps?.content || undefined}
							footer={modalProps?.footer || undefined}
							isActived={modalProps?.isActived || undefined}
							setModalProps={setModalProps}
						/>
						{typeof children !== 'undefined' ? children : ''}
					</NearDataProvider>
				</WalletProvider>
			</ThemeProvider>
		</DarkModeContext.Provider>
	);
};

export type IModalProps = {
	header?: ReactElement | undefined;
	content?: ReactElement | undefined;
	footer?: ReactElement | undefined;
	isActived?: boolean | undefined;
};
export const Modal = (props: IModalProps & { setModalProps: React.Dispatch<React.SetStateAction<IModalProps>> }) => {
	const { header, content, footer, isActived, setModalProps } = props;
	const closeModal = () => {
		setModalProps({
			...props,
			isActived: false,
		});
	};
	return (
		<>
			{isActived && (
				<>
					<div
						className="modalArea"
						style={{
							zIndex: '999999999',
							width: '100vw',
							height: '100vh',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
							position: 'fixed',
						}}
						onClick={(ev: any) => {
							closeModal();
						}}
					/>
					<div
						className="modalArea"
						style={{
							margin: '0 auto',
							marginTop: 'calc(50vh - 225px)',
							zIndex: '9999999999',
							width: 'auto',
							height: 'auto',
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
							position: 'fixed',
						}}>
						<div
							className="modalBox"
							style={{
								display: 'flex',
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
								height: 'auto',
								minHeight: '200px',
								width: '450px',
								borderRadius: '8px',
								backgroundColor: '#121213',
								boxShadow: '0px 0px 10px rgba(0,0,0,0.8)',
								border: '1px solid #63cdb4',
								flexDirection: 'row',
								flexWrap: 'wrap',
								padding: '32px',
							}}>
							<div
								className="modalHeader"
								style={{
									display: 'flex',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									width: '100%',
								}}>
								{typeof header !== 'undefined' ? header : ``}
							</div>
							<div
								className="modalContent"
								style={{
									display: 'flex',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									width: '100%',
								}}>
								{typeof content !== 'undefined' ? content : ``}
							</div>
							<div
								className="modalFooter"
								style={{
									display: 'flex',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									width: '100%',
								}}>
								{typeof footer !== 'undefined' ? footer : ``}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};
