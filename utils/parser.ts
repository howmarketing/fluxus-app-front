/**
 * PARSE RECURSIVELY JSON DATA, ARRAY OF JSON DATA, ARRAY OF OBJECT WITH VALUE AS JSON DATA ETC
 * MIND EXPLAINS -
 * Do this process as deep as it need to be
 * ---->>>>
 * [some_data_as_any_type ---[parsed-to]--> some_data_as_some_iterable_type ---[parsed-to]--> start_again_for_each_value_of_iterated_data ]
 * <<<<----------
 * That is started so far from the shallow, but so, it start to watch the fall into the deeper as it is. Just end when dive in was watched and the deep was parsed turning it from deep to shallow "now"
 * @description You can parse all deep data recursively into propose JSON scheme
 * @param dataToParse
 */
export const UtilParser_RecursiveParseJson = async (
	dataToParse: string | Array<any> | Record<any, any>,
): Promise<string | Array<any> | Record<any, any>> => {
	// Parse string to json
	const tryParseJsonToObject = async ($jsonString = '') => {
		try {
			// If it is not an string or the string do not have an "{/}" so it can not be an json string
			const isJson = !(
				typeof $jsonString !== 'string' ||
				`${$jsonString}`.indexOf('{') < 0 ||
				`${$jsonString}`.indexOf('}') < 0
			);
			if (!isJson) {
				return $jsonString;
			}
			return JSON.parse($jsonString);
		} catch (e) {
			return $jsonString;
		}
	};
	// Action to parse string data toobject as string
	const actionsToStringValue = async ($dataToParse: any) => {
		if (!(typeof $dataToParse === 'string')) return $dataToParse;
		return tryParseJsonToObject($dataToParse);
	};
	// Action to itere object array parsing tchildrens when json values, as it can keep in deep the recursive parses
	const itereArrayToParseJson = async ($dataArrayObjectToItereParsing: any): Promise<Array<any>> => {
		if (!(typeof $dataArrayObjectToItereParsing === 'object' && Array.isArray($dataArrayObjectToItereParsing)))
			return $dataArrayObjectToItereParsing;

		const arrayItereParsesResponse = await Promise.all(
			$dataArrayObjectToItereParsing.map(async ($iteratedValue, index) =>
				UtilParser_RecursiveParseJson($iteratedValue),
			),
		);
		return arrayItereParsesResponse;
	};
	// Action to itere key in value from object to parse they possible childrens json values, as it can keep in deep the recursive parses
	const itereObjectToParseJson = async ($dataObjectToItereParsing: any): Promise<Record<any, any> | Array<any>> => {
		if (typeof $dataObjectToItereParsing !== 'object' || Array.isArray($dataObjectToItereParsing))
			return $dataObjectToItereParsing;

		const objectItereParseResponse = {};
		const objKeys = Object.keys($dataObjectToItereParsing);
		objKeys.map(async objKey => {
			objectItereParseResponse[objKey] = await UtilParser_RecursiveParseJson($dataObjectToItereParsing[objKey]);
			return null;
		});
		return objectItereParseResponse;
	};
	// Let it change as it changes as it need to change when it has changed
	let parsedData: Record<any, any> | Array<any> | string = dataToParse;
	// try first step as parse thinking as it is an string json data, parsing it as it need to be
	parsedData = await actionsToStringValue(parsedData); // First step always needs to be the string json datas process to parse it
	// After parse the json string data, it could be a data such as array, object or anything
	// So it need to keep recursively parsed, from now thinking like this is an array data, or orbject data, that need to be itered
	//  - as it needs to be changed along the recursively parses deep process
	parsedData = await itereArrayToParseJson(parsedData); // Array matriz first or object, does not metter as it is in recursively checks
	parsedData = await itereObjectToParseJson(parsedData);
	// This is the end of all recursively parses, no matter how deep it was, when it got here, we have all parses done.
	return parsedData;
};
