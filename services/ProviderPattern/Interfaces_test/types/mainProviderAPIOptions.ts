/**
 * @DEV
 * !! PAY ATTENTION HERE !!
 * STATUS:
 *  - IN DEVELOPMENT;
 *  - NOT IMPLEMENTED YET
 *  - NOT TESTED FOR IMPLEMENTS
 *  - IN PROGRESS TO CREATION
 *
 * CONSIDERATIONS
 *  - As it is in develop progress, it is being committed without break changes, so do not considers it to code review until some first release
 */
export const LITERAL_ENDPOINT_TYPES = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const;
export type IENDPOINT_TYPES_NAME = typeof LITERAL_ENDPOINT_TYPES[number];

/**
 * Type for literal endpoints converter GraphQl Types
 *
 * @type {{ readonly GET: "QUERY"; readonly POST: "MUTATE"; readonly PUT: "MUTATE"; readonly PATCH: "MUTATE"; readonly DELETE: "MUTATE"; readonly OPTIONS: "MUTATE"; }}
 */
export const LITERAL_ENDPOINT_TYPES_CONVERTED_TO_GRAPHQL = {
	GET: 'QUERY',
	POST: 'MUTATE',
	PUT: 'MUTATE',
	PATCH: 'MUTATE',
	DELETE: 'MUTATE',
	OPTIONS: 'MUTATE',
} as const;

/**
 * Type for converted GraphQl endpoint Types
 *
 * @export
 * @typedef {IENDPOINT_TYPES_NAME2}
 */
export type IENDPOINT_TYPES_NAME2 = typeof LITERAL_ENDPOINT_TYPES_CONVERTED_TO_GRAPHQL;
