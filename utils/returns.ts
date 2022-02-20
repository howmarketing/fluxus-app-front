export const makeWait = async (msTime = 2000): Promise<boolean> => {
	const a = await new Promise<boolean>((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, msTime);
	});
	return a;
};
