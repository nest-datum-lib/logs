import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	BalancerRepository,
	BalancerService, 
} from 'nest-datum/balancer/src';
import { CacheService } from 'nest-datum/cache/src';
import { Err } from './err.entity';
import { ErrService } from './err.service';
import { ErrController } from './err.controller';

@Module({
	controllers: [ ErrController ],
	imports: [
		TypeOrmModule.forFeature([ Err ]),
	],
	providers: [
		BalancerRepository, 
		BalancerService,
		CacheService,
		ErrService, 
	],
})
export class ErrModule {
}
