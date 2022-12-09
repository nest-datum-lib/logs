import getCurrentLine from 'get-current-line';
import { Controller } from '@nestjs/common';
import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { BalancerService } from 'nest-datum/balancer/src';
import * as Validators from 'nest-datum/validators/src';
import { WarningService } from './warning.service';

@Controller()
export class WarningController {
	constructor(
		private readonly warningService: WarningService,
		private readonly balancerService: BalancerService,
	) {
	}

	@MessagePattern({ cmd: 'warning.many' })
	async many(payload) {
		try {
			const many = await this.warningService.many({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_WARNING_MANY'] ],
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

	@MessagePattern({ cmd: 'warning.one' })
	async one(payload) {
		try {
			const output = await this.warningService.one({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_ERR_ONE'] ],
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

	@EventPattern('warning.drop')
	async drop(payload) {
		try {
			await this.warningService.drop({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_ERR_DROP'] ],
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

	@EventPattern('warning.dropMany')
	async dropMany(payload) {
		try {
			await this.warningService.dropMany({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_ERR_DROP_MANY'] ],
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

	@EventPattern('warning.create')
	async create(payload) {
		try {
			const output = await this.warningService.create({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_ERR_CREATE'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id']),
				userId: Validators.id('userId', payload['userId']),
				replicaId: Validators.id('replicaId', payload['appId'], {
					isRequired: true,
				}),
				replicaHost: Validators.str('replicaHost', payload['appHost'], {
					isRequired: true,
					min: 1,
					max: 255,
				}),
				replicaPort: Validators.int('replicaPort', payload['appPort'], {
					isRequired: true,
					min: 1,
				}),
				serviceName: Validators.str('serviceName', payload['appName'], {
					isRequired: true,
					min: 1,
					max: 255,
				}),
				method: Validators.str('method', payload['method'], {
					isRequired: true,
					min: 1,
					max: 255,
				}),
				content: Validators.str('content', payload['content'], {
					isRequired: true,
					min: 1,
					max: 1999,
				}),
				file: Validators.str('file', payload['file'], {
					isRequired: true,
					min: 1,
					max: 255,
				}),
				line: Validators.int('line', payload['line'], {
					isRequired: true,
					min: 1,
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

	@EventPattern('warning.update')
	async update(payload) {
		try {
			await this.warningService.update({
				user: Validators.token('accessToken', payload['accessToken'], {
					accesses: [ process['ACCESS_LOGS_ERR_UPDATE'] ],
					isRequired: true,
				}),
				id: Validators.id('id', payload['id']),
				newId: Validators.id('newId', payload['newId']),
				userId: Validators.id('userId', payload['userId']),
				replicaId: Validators.id('replicaId', payload['appId']),
				replicaHost: Validators.str('replicaHost', payload['appHost'], {
					min: 1,
					max: 255,
				}),
				replicaPort: Validators.int('replicaPort', payload['appPort'], {
					min: 1,
				}),
				serviceName: Validators.str('serviceName', payload['appName'], {
					min: 1,
					max: 255,
				}),
				method: Validators.str('method', payload['method']),
				content: Validators.str('content', payload['content']),
				file: Validators.str('file', payload['file']),
				line: Validators.int('line', payload['line']),
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
