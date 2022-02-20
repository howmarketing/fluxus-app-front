import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
		::-webkit-scrollbar{
			width:6px;
			background-color:transparent;
		}
		::-webkit-scrollbar-thumb:vertical{
			background-color:${({ theme }) => theme.colors.secondary_light_purple}80;
			border-radius:1000px
		}
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body{
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-direction: row;
		flex-wrap: wrap;
		overflow-wrap: break-word;
		min-height: 100vh;
        background-color: ${({ theme }) => theme.colors.background_primary};
        color: ${({ theme }) => theme.colors.text};
        -webkit-font-smoothing: antialiased;
		overflow-x:clip;

		& > div#__next{
			display: flex;
			justify-content: center;
			align-items: flex-start;
			flex-direction: row;
			flex-wrap: wrap;
			overflow-wrap: anywhere;
			width: 100%;
		}
    }

    body, input, textarea, button {
        font-family: 'Mulish';
        font-weight: 400;
    }

    h1, h2, h3, h4, h5{
        font-family: 'Syncopate', sans-serif;
				font-weight: 700;
    }
	.Toastify__toast-body {
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		height: 48px;
		width: 100%;
	}
	.Toastify__toast-body > div:last-child {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 8px;
	}
`;
