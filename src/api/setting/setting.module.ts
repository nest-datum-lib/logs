import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { Setting } from './setting.entity';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({
	controllers: [ SettingController ],
	imports: [
		TypeOrmModule.forFeature([ Setting ]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		SettingService, 
	],
})
export class SettingModule {
}

