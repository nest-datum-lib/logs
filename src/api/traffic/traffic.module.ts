import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { Traffic } from './traffic.entity';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';

@Module({
	controllers: [ TrafficController ],
	imports: [
		TypeOrmModule.forFeature([ Traffic ]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		TrafficService, 
	],
})
export class TrafficModule {
}
