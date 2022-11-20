import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import {
	RegistryService,
	LogsService,
	CacheService,
} from '@nest-datum/services';
import { redisConfig } from 'config/redis';

@Module({
	controllers: [],
	imports: [
		RedisModule.forRoot(redisConfig),
	],
	providers: [
		RegistryService,
		LogsService,
		CacheService,
	],
})

export class RegistryModule {
}
