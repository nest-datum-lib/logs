require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
	const app = await NestFactory.create(SeedModule);
	const seeder = app.get(SeedService);

	await seeder.send();
	await app.close();
}

bootstrap();
