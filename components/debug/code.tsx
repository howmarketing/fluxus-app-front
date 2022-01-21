/* eslint-disable react/react-in-jsx-scope */
import { ReactChild } from 'react';

export type CodeProps = {
	children?: ReactChild;
	backgroundColor?: string | undefined;
	textColor?: string | undefined;
	prettyJson?: boolean | undefined;
	displayTitle?: string | undefined;
};
export default function Code({ backgroundColor = '#ffa3a3', textColor = '#bd0000', ...props }: CodeProps) {
	const envIsDev = process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development';
	return (
		<code
			style={{
				backgroundColor,
				color: textColor,
				fontWeight: 'bold',
				borderRadius: '8px',
				border: `2px solid ${textColor}`,
				padding: '10px 12px',
				width: 'auto',
				maxWidth: 'calc(100vw - 66px)',
				height: 'auto',
				maxHeight: 'calc(100vh - 126px)',
				margin: '25px auto',
				overflowWrap: 'anywhere',
				display: envIsDev ? 'flex' : 'none',
				justifyContent: 'flex-start',
				flexDirection: 'column',
				alignItems: 'flex-start',
				fontSize: '0.9rem',
				overflowX: 'auto',
				overflowY: 'auto',
			}}>
			{props?.displayTitle && (
				<h1
					style={{
						textTransform: 'uppercase',
						width: '100%',
						textAlign: 'center',
						display: 'inline-block',
						margin: 0,
						padding: '10px 15px',
						fontSize: '1.2rem',
					}}>
					{props.displayTitle}
				</h1>
			)}

			{props?.prettyJson && (
				<pre>{props?.children || '{success:false,msg:"No children element was recived."}'}</pre>
			)}
			{!props?.prettyJson && <>{props?.children || 'No children element was recived.'}</>}
		</code>
	);
}
