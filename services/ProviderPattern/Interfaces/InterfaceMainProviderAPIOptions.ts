/**
 * !! PAY ATENTION HERE !!
 * STATUS:
 *  - IN DEVELOPMENT;
 *  - NOT IMPLEMENTED YET
 *  - NOT TESTED FOR IMPLEMENTS
 *  - IN PROGRESS TO CREATION
 *
 * CONSIDERATIONS
 *  - As it is in develop progress, it is being commited without break chages, so do not coniders it to code review until some first release
 */
const LITERAL_ENDPOINT_TYPES = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const;
type IENDPOINT_TYPES_NAME = typeof LITERAL_ENDPOINT_TYPES[number];

const LITERAL_ENDPOINT_TYPES_CONVERTED_TO_GRAPHQL = {
	GET: 'QUERY',
	POST: 'MUTATE',
	PUT: 'MUTATE',
	PATCH: 'MUTATE',
	DELETE: 'MUTATE',
	OPTIONS: 'MUTATE',
} as const;
type IENDPOINT_TYPES_NAME2 = typeof LITERAL_ENDPOINT_TYPES_CONVERTED_TO_GRAPHQL;

export type InterfaceMainProviderAPIOptions = {
	enpoint_url: string;
	endpoint_types: Array<IENDPOINT_TYPES_NAME2[IENDPOINT_TYPES_NAME]>;
};
