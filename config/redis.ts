import { findEnvPropertiesByTwoOccurrences } from '@nest-datum/common';

const configArr: Array<any> = findEnvPropertiesByTwoOccurrences('REDIS_', '_NAMESPACE', (index) => ({
	namespace: process.env[`REDIS_${index}_NAMESPACE`],
	host: process.env[`REDIS_${index}_HOST`],
	port: Number(process.env[`REDIS_${index}_PORT`]),
	password: process.env[`REDIS_${index}_PASSWORD`],
	db: Number(process.env[`REDIS_${index}_DB`]),
}));

export const redisConfig = {
	config: configArr,
};
