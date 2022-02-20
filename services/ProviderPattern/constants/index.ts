const PROTOCOL_SYMBOL = ['NEAR', 'AURORA', 'METATESTE', 'WEB3GENERIC'] as const;
export type IPROTOCOL_SYMBOL = typeof PROTOCOL_SYMBOL[number];
export type IPROTOCOL_NAME = `${IPROTOCOL_SYMBOL}ProtocolProvider`;
export type IPROTOCOLS = { [P in IPROTOCOL_SYMBOL]: `${P}ProtocolProvider` };

export const PROTOCOLS: IPROTOCOLS = {
	NEAR: 'NEARProtocolProvider',
	AURORA: 'AURORAProtocolProvider',
	METATESTE: 'METATESTEProtocolProvider',
	WEB3GENERIC: 'WEB3GENERICProtocolProvider',
};
