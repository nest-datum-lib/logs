import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { redisConfig } from 'config/redis';
import { BalancerRepository } from './balancer.repository';
import { BalancerService } from './balancer.service';

@Module({
	imports: [
		RedisModule.forRoot(redisConfig),
	],
	controllers: [],
	providers: [ 
		BalancerRepository,
		BalancerService,
	],
})
export class BalancerModule {
}
