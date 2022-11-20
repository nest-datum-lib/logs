import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { findEnvPropertiesByTwoOccurrences } from '@nest-datum/common';

const configArr: Array<any> = findEnvPropertiesByTwoOccurrences('MYSQL_SLAVE', '_HOST', (index) => ({
	host: process.env[`MYSQL_SLAVE${index}_HOST`],
	port: Number(process.env[`MYSQL_SLAVE${index}_PORT`]),
	username: process.env[`MYSQL_SLAVE${index}_USER`],
	password: process.env[`MYSQL_SLAVE${index}_USER_PASSWORD`],
	database: process.env[`MYSQL_SLAVE${index}_DATABASE`],
}));

export const typeormConfig: TypeOrmModuleOptions = {
	type: 'mysql',
	replication: {
		master: {
			host: process.env.MYSQL_MASTER_HOST,
			port: Number(process.env.MYSQL_MASTER_PORT),
			username: process.env.MYSQL_MASTER_USER,
			password: process.env.MYSQL_MASTER_USER_PASSWORD,
			database: process.env.MYSQL_MASTER_DATABASE,
		},
		slaves: [ ...configArr ],
	},
	autoLoadEntities: true,
	synchronize: true,
};
