require('dotenv').config();

import { v4 as uuidv4 } from 'uuid';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { TransportStrategies } from 'nest-datum/common/src';
import { 
	BalancerModule,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { 
	getEnvValue,
	onExit,
	onWarning,
	onUncaughtException, 
} from 'nest-datum/common/src';
import { AppModule } from './app.module';

process.on('exit', onExit);
process.on('warning', onWarning);
process.on('uncaughtException', onUncaughtException);

async function createApp() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		strategy: new TransportStrategies[process.env.APP_TRANSPORTER]({
			host: process.env.APP_HOST,
			port: Number(process.env.APP_PORT),
		}),
	});
	const balancer = await NestFactory.create(BalancerModule);
	const balancerService = balancer.get(BalancerService);

	const registred = await balancerService.registry({
		email: process['USER_ROOT_EMAIL'],
		login: process['USER_ROOT_LOGIN'],
		password: process['USER_ROOT_PASSWORD'],
	});

	if (registred) {
		console.log('Replica listening on port:', process.env.APP_PORT);

		await app.listen();
	}
	else {
		console.error('Error while adding replica to services registry in redis. Check the settings in the .env file.');

		await app.close();
	}
	await balancer.close();
};

async function bootstrap() {
	process['USER_ROOT_EMAIL'] = process.env.USER_ROOT_EMAIL;
	process['USER_ROOT_LOGIN'] = process.env.USER_ROOT_LOGIN;
	process['USER_ROOT_PASSWORD'] = process.env.USER_ROOT_PASSWORD;
	process['PROJECT_ID'] = getEnvValue('PROJECT_ID');
	process['APP_ID'] = getEnvValue('APP_ID') || uuidv4();
	process['JWT_SECRET_ACCESS_KEY'] = getEnvValue('JWT_SECRET_ACCESS_KEY');
	process['JWT_SECRET_REFRESH_KEY'] = getEnvValue('JWT_SECRET_REFRESH_KEY');

	await createApp();
};

bootstrap();
