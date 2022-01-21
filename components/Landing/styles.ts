import styled from 'styled-components';

export const Background = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 22px;
	background-color: ${({ theme }) => theme.colors.primary};
	width: 90vw;
	height: auto;
	margin: 0 auto;
	border-radius: 8px;
	padding: 20px;
	box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
	margin-top: calc(50vh - 65px);
	text-align: center;
`;
export const WrappContent = styled.div`
	display: flex;
	justify-content: center;
	align-items: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
	overflow-wrap: anywhere;
	width: 100%;
	min-height: 100vh;
	background-color: ${({ theme }) => theme.colors.background_primary};
	background-repeat: no-repeat !important;
	background-size: 1700px auto !important;
	background-position: center -5px !important;
`;

export const Main = styled.main`
	display: flex;
	justify-content: center;
	align-items: flex-start;
	flex-direction: row;
	width: 100%;
	min-height: calc(100vh - 335px);
	margin-top: 180px;
	@media screen and (max-width: 800px) {
		margin-top: 130px;
	}
`;

export const Row = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: column;
	background-color: transparent;
	width: 100%;
	max-width: 1400px;
	height: auto;
	padding: 15px;
	box-shadow: none;
	text-align: left;
`;
