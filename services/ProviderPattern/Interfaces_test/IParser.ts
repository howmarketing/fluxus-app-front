/* eslint-disable no-use-before-define */
/**
 *
 *
 *
 *
 *
 * STRING INFER FORMAT TO CAMEL CASE NAME CONVENTION
 *  * @example
 * ```typescript
 *    //example of how to use this infer type
 * 		type example1 = IParseStringToCamelCase<'Infer_string_parse_from_snake_case_to_camel_case'>;
 * 		type example2 = IParseStringToCamelCase<'Infer string parse from_normal-text@to-camel-case-name#convention'>;
 * 		type example3 = IParseStringToCamelCase<'INFER@STRING PARSE FROM_NORMAL-TEXT@TO-CAMEL-CASE-NAME#CONVENTION'>;
 * ```
 */
export type IParseStringToCamelCase<
	S extends string,
	LowerFirst extends boolean = true
> = LowerFirst extends true
	? IParseStringToCamelCase<Lowercase<S>, false>
	: S extends `${infer L} ${infer R}`
	? IParseStringToCamelCase<
			IParseStringToCamelCaseByDelimiter<`${L} ${R}`, ' ', false>,
			false
	  >
	: S extends `${infer L}_${infer R}`
	? IParseStringToCamelCase<
			IParseStringToCamelCaseByDelimiter<`${L}_${R}`, '_', false>,
			false
	  >
	: S extends `${infer L}-${infer R}`
	? IParseStringToCamelCase<
			IParseStringToCamelCaseByDelimiter<`${L}-${R}`, '-', false>,
			false
	  >
	: S extends `${infer L}#${infer R}`
	? IParseStringToCamelCase<
			IParseStringToCamelCaseByDelimiter<`${L}#${R}`, '#', false>,
			false
	  >
	: S extends `${infer L}@${infer R}`
	? IParseStringToCamelCase<
			IParseStringToCamelCaseByDelimiter<`${L}@${R}`, '@', false>,
			false
	  >
	: S extends `${infer L}:${infer R}`
	? IParseStringToCamelCase<
			IParseStringToCamelCaseByDelimiter<`${L}:${R}`, ':', false>,
			false
	  >
	: IParseStringToCamelCaseByDelimiter<S, '&', false>;

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * STRING INFER FORMAT TO CAMEL CASE NAME CONVENTION DELIMITER
 *  * @example
 * ```typescript
 *    //example of how to use this infer type
 * 		type example1 = IParseStringToCamelCaseByDelimiter<'Infer_string_parse_from_underscore_delimiter_to_camel_case'>;
 * 		type example2 = IParseStringToCamelCaseByDelimiter<'Infer-string-parse-from-underscore-delimiter-to-camel-case', '-'>;
 * 		type example3 = IParseStringToCamelCaseByDelimiter<'Infer#string#parse#from#underscore#identified#delimiter#to#camel#case', '#'>;
 * 		type example4 = IParseStringToCamelCaseByDelimiter<'INFER@STRING@PARSE@FROM@IDENTIFIED@DELIMITER@TO@CAMEL@CASE', '@'>;
 * ```
 */
export type IParseStringToCamelCaseByDelimiter<
	S extends string,
	D extends string = '_',
	LowerFirst extends boolean = true
> = LowerFirst extends true
	? IParseStringToCamelCaseByDelimiter<Lowercase<S>, D, false>
	: IParseStringToCamelCaseByDelimiterLogic<S, D>;
/**
 * LOGIC FOR IMPLEMENTED BY IParseStringToCamelCaseByDelimiter
 */
type IParseStringToCamelCaseByDelimiterLogic<
	S extends string,
	D extends string
> = S extends `${infer L}${D}${infer R}`
	? `${L}${Capitalize<IParseStringToCamelCaseByDelimiterLogic<R, D>>}`
	: `${Uncapitalize<Capitalize<S>>}`;

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * PARSE OBJECT SNAKE CASE STRUCTURE TO CAMEL CASE
 *  * @example [1]
 * ```typescript
 *    //example of how to use this infer type
 * 	type snakeCaseObjectExampleTester = IParseObjectFromSnakeCaseToCamelCase<{
 * 			poolId: number;
 * 			deep_test: {
 * 				deep_property_one: number;
 * 				deep_property_deeper: {
 * 					end_of_deep: string;
 * 				};
 * 			};
 * }>;
 *
 *
 * * @example [2]
 *  type snakeCaseArrayObjectExampleTester = IParseObjectFromSnakeCaseToCamelCase<
 * 	[
 * 		{
 * 			poolId: number;
 * 			deep_test: {
 * 				deep_property_one: number;
 * 				deep_property_deeper: {
 * 					end_of_deep: string;
 * 				};
 * 			};
 * 		}
 * 	]
 * > ;
 * ```
 */
export type IParseObjectFromSnakeCaseToCamelCase<
	T,
	LowerFirst extends boolean = false
> = T extends object
	? T extends Array<Record<string, unknown>>
		? IParseArrayFromSnakeCaseToCamelCase<T>
		: {
				[K in keyof T as IParseStringToCamelCase<
					K & string,
					LowerFirst
				>]: T[K] extends object
					? IParseObjectFromSnakeCaseToCamelCase<T[K]>
					: T[K];
		  }
	: T;
type IParseArrayFromSnakeCaseToCamelCase<
	T,
	LowerFirst extends boolean = false
> = T extends object
	? T extends Array<Record<string, unknown>>
		? Array<IParseObjectFromSnakeCaseToCamelCase<T[number], LowerFirst>>
		: IParseObjectFromSnakeCaseToCamelCase<T, LowerFirst>
	: T;
