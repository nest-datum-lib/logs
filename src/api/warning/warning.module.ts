import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { Warning } from './warning.entity';
import { WarningService } from './warning.service';
import { WarningController } from './warning.controller';

@Module({
	controllers: [ WarningController ],
	imports: [
		TypeOrmModule.forFeature([ Warning ]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		WarningService, 
	],
})
export class WarningModule {
}
