import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'config/typeorm';
import { redisConfig } from 'config/redis';
import { CacheService } from 'nest-datum/cache/src';
import { SeedService } from './seed.service';
import { Setting } from 'src/api/setting/setting.entity';
import { SettingSeeder } from './setting.seeder';

@Module({
	controllers: [],
	imports: [
		TypeOrmModule.forRoot(typeormConfig),
		RedisModule.forRoot(redisConfig),
		TypeOrmModule.forFeature([
			Setting,
		]),
	],
	providers: [
		CacheService,
		SeedService,
		SettingSeeder,
	]
})

export class SeedModule {
}
