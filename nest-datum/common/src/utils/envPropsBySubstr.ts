
const envPropsBySubstr = (firstSubstring: string, secondSubstring: string, callback = (index, key) => {}) => {
	const envArr = Object.keys(process.env || {});
	const envDbReplicas = envArr.filter((key) => key.includes(firstSubstring)
		&& key.includes(secondSubstring));

	return envDbReplicas.map((key) => {
		const index = (key.replace(firstSubstring, '')).replace(secondSubstring, '');

		return callback(index, key);
	});
};

export default envPropsBySubstr;
