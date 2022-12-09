import { v4 as uuidv4 } from 'uuid';
import { envPropsBySubstr } from 'nest-datum/common/src';

const configArr: Array<any> = envPropsBySubstr('REDIS_', '_HOST', (index) => {
	process[`REDIS_${index}`] = uuidv4();

	return {
		namespace: process[`REDIS_${index}`],
		host: process.env[`REDIS_${index}_HOST`],
		port: Number(process.env[`REDIS_${index}_PORT`]),
		password: process.env[`REDIS_${index}_PASSWORD`],
		db: Number(process.env[`REDIS_${index}_DB`]),
	};
});

export const redisConfig = {
	config: configArr,
};
