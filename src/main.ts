require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import {
	MicroserviceOptions,
	Transport,
} from '@nestjs/microservices';
import { RegistryService } from '@nest-datum/services';
import { RegistryModule } from './registry.module';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport[process.env.TRANSPORT_PROVIDER],
		options: {
			host: process.env.TRANSPORT_HOST,
			port: Number(process.env.TRANSPORT_PORT),
		},
	});
	const registry = await NestFactory.create(RegistryModule);
	const registryService = registry.get(RegistryService);
	
	await app.listen();
	await registryService.start();
	await registry.close();
}

bootstrap();
