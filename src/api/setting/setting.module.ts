import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { Setting } from './setting.entity';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({
	controllers: [ SettingController ],
	imports: [
		TypeOrmModule.forFeature([ Setting ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		SettingService, 
	],
})
export class SettingModule {
}

