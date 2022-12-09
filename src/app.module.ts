import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'config/typeorm';
import { redisConfig } from 'config/redis';
import { 
	BalancerModule,
	BalancerRepository, 
} from 'nest-datum/balancer/src';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettingModule } from './api/setting/setting.module';
import { ErrModule } from './api/err/err.module';
import { WarningModule } from './api/warning/warning.module';
import { NotificationModule } from './api/notification/notification.module';
import { TrafficModule } from './api/traffic/traffic.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(typeormConfig),
		RedisModule.forRoot(redisConfig),
		BalancerModule,
		SettingModule,
		ErrModule,
		WarningModule,
		NotificationModule,
		TrafficModule,
	],
	controllers: [ AppController ],
	providers: [ AppService ],
})
export class AppModule {
}
