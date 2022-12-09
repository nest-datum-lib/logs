const fs = require('fs');
const os = require('os');
const path = require('path');

import readEnvVars from './readEnvVars';

/**
 * Updates value for existing key or creates a new key=value line
 *
 * This function is a modified version of https://stackoverflow.com/a/65001580/3153583
 *
 * @param {string} key Key to update/insert
 * @param {string} value Value to update/insert
 */
const setEnvValue = (key, value) => {
	const envFilePath = path.resolve(process.env.PWD, '.env');
	const envVars = readEnvVars();
	const targetLine = envVars.find((line) => line.split('=')[0] === key);
	
	if (targetLine !== undefined) {
		const targetLineIndex = envVars.indexOf(targetLine);
		
		envVars.splice(targetLineIndex, 1, `${key}=${value}`);
	}
	else {
		envVars.push(`${key}=${value}`);
	}
	fs.writeFileSync(envFilePath, envVars.join(os.EOL));
};

export default setEnvValue;
