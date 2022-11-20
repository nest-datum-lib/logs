import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { Traffic } from './traffic.entity';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';

@Module({
	controllers: [ TrafficController ],
	imports: [
		TypeOrmModule.forFeature([ Traffic ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		TrafficService, 
	],
})
export class TrafficModule {
}
