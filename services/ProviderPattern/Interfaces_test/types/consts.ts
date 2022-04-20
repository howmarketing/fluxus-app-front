/**
 *
 * ### Type as literal string of providers names that are recognized by the ProviderPattern
 * @description
 * 	-	The Provider Pattern use that literals to know what providers must be implemented;
 * 	-	With these literals, Provider Pattern require the correctly implementation adjusts when it changes.
 * @DEV
 *	-	These extra names as METATESTE, WEB3GENERIC, AURORA is really needed about now to drive behavior tests
 */
export type PROTOCOL_SYMBOL = ['NEAR', 'AURORA', 'METATESTE', 'WEB3GENERIC'];

/**
 *
 * ### Type IPROTOCOL_SYMBOL as:
 * 	*	-	Literals shape of enabled protocols that infer the correctly and mandatory usages of patter;
 * 	*	-	Bring the dumb way to implement the design patter as it works almost like a user manual.
 *
 * @export
 * @typedef {IPROTOCOL_SYMBOL}
 */
export type IPROTOCOL_SYMBOL = PROTOCOL_SYMBOL[number];

/**
 *
 * ### Type IPROTOCOL_NAME as:
 * 	*	-	Literals shape of enabled protocols that infer the correctly and mandatory usages of patter;
 * 	*	-	Bring the dumb way to implement the design patter as it works almost like a user manual.
 *
 * @export
 * @typedef {IPROTOCOL_NAME}
 */
export type IPROTOCOL_NAME = `${IPROTOCOL_SYMBOL}ProtocolProvider`;

/**
 *
 * ### Type IPROTOCOLS as:
 * 	*	-	Literals shape of enabled protocols that infer the correctly and mandatory usages of patter;
 * 	*	-	Bring the dumb way to implement the design patter as it works almost like a user manual.
 *
 * @export
 * @typedef {IPROTOCOLS}
 */
export type IPROTOCOLS = { [P in IPROTOCOL_SYMBOL]: `${P}ProtocolProvider` };
