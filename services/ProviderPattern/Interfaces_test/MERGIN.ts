/**
 * FILE EXIST JUST FOR GET TOGETHER THE TYPES ANS INTERFACES AS ONE PLACE EASY TO MAP AND SEND TO THEY CORRECTLY PLACES
 * THIS FILE WILL BE REMOVED AFTER STABLE TYPES AND INTERFACES BEEN RELEASED TO DEV IMPLEMENTATIONS
 */
import { IParseObjectFromSnakeCaseToCamelCase } from '@ProviderPattern/Interfaces_test/IParser';

export type ICamelCase<
	T,
	LowerFirst extends boolean = false
> = IParseObjectFromSnakeCaseToCamelCase<T, LowerFirst>;
