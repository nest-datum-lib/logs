import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
	controllers: [ NotificationController ],
	imports: [
		TypeOrmModule.forFeature([ Notification ]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		NotificationService, 
	],
})
export class NotificationModule {
}
