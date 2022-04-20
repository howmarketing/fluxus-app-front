const LiteralMainProviderConfigPropertiesToStringType = [
	'networkId',
	'nodeUrl',
	'walletUrl',
	'helperUrl',
	'explorerUrl',
	'indexerUrl',
	'sodakiApiUrl',
	'fluxusApiUrl',
	'REF_FI_CONTRACT_ID',
	'FLUXUS_CONTRACT_ID',
	'FLUXUS_VAULT_CONTRACT_ID',
	'REF_FARM_CONTRACT_ID',
	'FLUXUS_FARM_CONTRACT_ID',
	'WRAP_NEAR_CONTRACT_ID',
	'REF_ADBOARD_CONTRACT_ID',
	'REF_TOKEN_ID',
	'FLUXUS_TOKEN_ID',
	'REF_AIRDROP_CONTRACT_ID',
] as const;
const LiteralMainProviderConfigPropertiesToNumberType = [
	'POOL_TOKEN_REFRESH_INTERVAL',
] as const;
export type ILiteralMainProviderConfigPropertiesForStringType =
	typeof LiteralMainProviderConfigPropertiesToStringType[number];

export type ILiteralMainProviderConfigPropertiesForNumberType =
	typeof LiteralMainProviderConfigPropertiesToNumberType[number];

export type IMainProviderConfigStringType = {
	[S in ILiteralMainProviderConfigPropertiesForStringType]: string;
};
export type IMainProviderConfigNumberType = {
	[N in ILiteralMainProviderConfigPropertiesForNumberType]: number | string;
};
export type IMainProviderConfig = IMainProviderConfigStringType &
	IMainProviderConfigNumberType;
