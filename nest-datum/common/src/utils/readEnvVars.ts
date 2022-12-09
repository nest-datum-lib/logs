const fs = require('fs');
const os = require('os');
const path = require('path');

const readEnvVars = () => {
	const envFilePath = path.resolve(process.env.PWD, '.env');

	return fs.readFileSync(envFilePath, 'utf-8').split(os.EOL);
};

export default readEnvVars;
