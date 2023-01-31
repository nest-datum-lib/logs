const https = require('https');
const http = require('http');
const fs = require('fs');

const getFile = async (target: string | object, accessToken: string, checkExists = false) => {
	let processedTarget = target;

	if (typeof target === 'string') {
		try {
			processedTarget = JSON.parse(target);
		}
		catch (err) {
			processedTarget = target;
		}
	}
	if (!processedTarget) {
		throw new Error('Target file is undefined.');
	}
	if (typeof processedTarget === 'object') {
		if (!processedTarget['name']
			|| typeof processedTarget['name'] !== 'string') {
			throw new Error('Target "name" file is wrong format.');
		}
		if (!processedTarget['path']
			|| typeof processedTarget['path'] !== 'string') {
			throw new Error('Target "path" file is wrong format.');
		}
		if (!processedTarget['systemId']
			|| typeof processedTarget['systemId'] !== 'string') {
			throw new Error('Target "systemId" file is wrong format.');
		}
		const path = `${process.env.APP_ROOT_PATH}/${processedTarget['name']}`;

		if (checkExists) {
			const isExist = await (new Promise((resolve, reject) => {
				fs.exists(path, function (isExist) {
					resolve(isExist);
				});
			}));

			if (isExist) {
				return path;
			}
		}
		const url = `${process.env.APP_FILES_1_URL}${processedTarget['path']}?accessToken=${accessToken}`;
		const file = fs.createWriteStream(path);
		const request = (url.indexOf('https://') === 0)
			? https
			: http;

		await (new Promise((resolve, reject) => {
			const fetch = request.get(url, (response) => {
				if (response.statusCode !== 200
					&& response.statusCode !== 201) {
					return reject(new Error(`Request file "${url.toString()}" error`));
				}
				response.pipe(file);
			});

			fetch.on('error', (errRequest) => {
				fs.unlink(path, (errUnlink) => {
					if (errUnlink) {
						return reject(new Error(errUnlink.message));
					}
					return reject(new Error(errRequest.message));
				});
			});

			file.on('finish', () => {
				file.close();

				return resolve(true);
			});

			file.on('error', (errFile) => {
				fs.unlink(path, (errUnlink) => {
					if (errUnlink) {
						return reject(new Error(errUnlink.message));
					}
					return reject(new Error(errFile.message));
				});
			});
		}));
		return path;
	}
	else {
		return '';
	}
};

export default getFile;
