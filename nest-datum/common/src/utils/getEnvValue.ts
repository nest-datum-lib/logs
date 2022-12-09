import readEnvVars from './readEnvVars';

/**
 * Finds the key in .env files and returns the corresponding value
 *
 * @param {string} key Key to find
 * @returns {string|null} Value of the key
 */
const getEnvValue = (key) => {
	const envVars = readEnvVars();

	if (envVars
		&& Array.isArray(envVars)) {
		const matchedLine = (envVars || []).find((line) => line.split('=')[0] === key);

		return matchedLine !== undefined 
			? matchedLine.split('=')[1] 
			: null;
	}
	return null;
};

export default getEnvValue;
