import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { Warning } from './warning.entity';
import { WarningService } from './warning.service';
import { WarningController } from './warning.controller';

@Module({
	controllers: [ WarningController ],
	imports: [
		TypeOrmModule.forFeature([ Warning ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		WarningService, 
	],
})
export class WarningModule {
}
