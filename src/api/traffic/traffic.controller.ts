import getCurrentLine from 'get-current-line';
import { Controller } from '@nestjs/common';
import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { BalancerService } from 'nest-datum/balancer/src';
import * as Validators from 'nest-datum/validators/src';
import { TrafficService } from './traffic.service';

@Controller()
export class TrafficController {
	constructor(
		private readonly trafficService: TrafficService,
		private readonly balancerService: BalancerService,
	) {
	}

	@MessagePattern({ cmd: 'traffic.many' })
	async many(payload) {
		try {
			const many = await this.trafficService.many({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_TRAFFIC_MANY'] ],
					isRequired: true,
				}),
				relations: Validators.obj('relations', payload['relations']),
				select: Validators.obj('select', payload['select']),
				sort: Validators.obj('sort', payload['sort']),
				filter: Validators.obj('filter', payload['filter']),
				query: Validators.str('query', payload['query'], {
					min: 1,
					max: 255,
				}),
				page: Validators.int('page', payload['page'], {
					min: 1,
					default: 1,
				}),
				limit: Validators.int('limit', payload['limit'], {
					min: 1,
					default: 20,
				}),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return {
				total: many[1],
				rows: many[0],
			};
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@MessagePattern({ cmd: 'traffic.one' })
	async one(payload) {
		try {
			const output = await this.trafficService.one({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_TRAFFIC_ONE'] ],
					isRequired: true,
				}),
				relations: Validators.obj('relations', payload['relations']),
				select: Validators.obj('select', payload['select']),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('traffic.drop')
	async drop(payload) {
		try {
			await this.trafficService.drop({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_TRAFFIC_DROP'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
			});
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return true;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('traffic.dropMany')
	async dropMany(payload) {
		try {
			await this.trafficService.dropMany({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_TRAFFIC_DROP_MANY'] ],
					isRequired: true,
				}),
				ids: Validators.arr('ids', payload['ids'], {
					isRequired: true,
					min: 1,
				}),
			});
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return true;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('traffic.create')
	async create(payload) {
		try {
			const output = await this.trafficService.create({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_TRAFFIC_CREATE'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id']),
				userId: Validators.id('userId', payload['userId']),
				replicaId: Validators.id('replicaId', payload['appId'], {
					isRequired: true,
				}),
				ipAddr: Validators.ip('ipAddr', payload['ipAddr'], {
					isRequired: true,
				}),
				referrer: Validators.str('referrer', payload['referrer']),
				method: Validators.str('method', payload['method'], {
					isRequired: true,
					min: 1,
					max: 16,
				}),
				route: Validators.str('route', payload['route'], {
					isRequired: true,
					min: 1,
					max: 255,
				}),
				headers: Validators.obj('headers', payload['headers'], {
					min: 1,
					max: 999,
				}),
				queries: Validators.obj('queries', payload['queries'], {
					min: 1,
					max: 255,
				}),
				body: Validators.objOrArr('body', payload['body'], {
					min: 1,
					max: 255,
				}),
				cookies: Validators.obj('cookies', payload['cookies'], {
					min: 1,
					max: 255,
				}),
				createdAt: Validators.date('createdAt', payload['createdAt']),
			});

			this.balancerService.decrementServiceResponseLoadingIndicator();

			return output;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}

	@EventPattern('traffic.update')
	async update(payload) {
		try {
			await this.trafficService.update({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_TRAFFIC_UPDATE'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id']),
				newId: Validators.id('newId', payload['newId']),
				userId: Validators.id('userId', payload['userId']),
				replicaId: Validators.id('replicaId', payload['appId']),
				ipAddr: Validators.ip('ipAddr', payload['ipAddr']),
				referrer: Validators.str('referrer', payload['referrer']),
				method: Validators.str('method', payload['method'], {
					min: 1,
					max: 10,
				}),
				route: Validators.str('route', payload['route'], {
					min: 1,
					max: 255,
				}),
				headers: Validators.obj('headers', payload['headers'], {
					min: 1,
					max: 999,
				}),
				queries: Validators.obj('queries', payload['queries'], {
					min: 1,
					max: 255,
				}),
				body: Validators.objOrArr('body', payload['body'], {
					min: 1,
					max: 255,
				}),
				cookies: Validators.obj('cookies', payload['cookies'], {
					min: 1,
					max: 255,
				}),
				createdAt: Validators.date('createdAt', payload['createdAt']),
			});
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return true;
		}
		catch (err) {
			this.balancerService.log(err);
			this.balancerService.decrementServiceResponseLoadingIndicator();

			return err;
		}
	}
}
