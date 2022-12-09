import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { redisConfig } from 'config/redis';
import { BalancerRepository } from './balancer.repository';
import { BalancerService } from './balancer.service';

console.log('redisConfig 2222', redisConfig, process['REDIS_CACHE'], process['REDIS_BALANCER']);

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
