import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
	controllers: [ NotificationController ],
	imports: [
		TypeOrmModule.forFeature([ Notification ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		NotificationService, 
	],
})
export class NotificationModule {
}
