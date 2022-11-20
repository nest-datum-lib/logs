import getCurrentLine from 'get-current-line';
import * as Validators from '@nest-datum/validators';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { 
	RegistryService,
	LogsService, 
} from '@nest-datum/services';
import { TrafficService } from './traffic.service';

@Controller()
export class TrafficController {
	constructor(
		private readonly registryService: RegistryService,
		private readonly logsService: LogsService,
		private readonly trafficService: TrafficService,
	) {
	}

	@MessagePattern({ cmd: 'traffic.many' })
	async many(payload) {
		try {
			const many = await this.trafficService.many({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
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

			await this.registryService.clearResources();

			return {
				total: many[1],
				rows: many[0],
			};
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'traffic.one' })
	async one(payload) {
		try {
			const output = await this.trafficService.one({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				relations: Validators.obj('relations', payload['relations']),
				select: Validators.obj('select', payload['select']),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
			});

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'traffic.drop' })
	async drop(payload) {
		try {
			await this.trafficService.drop({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				id: Validators.id('id', payload['id'], {
					isRequired: true,
				}),
			});
			await this.registryService.clearResources();

			return true;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'traffic.dropMany' })
	async dropMany(payload) {
		try {
			await this.trafficService.dropMany({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				ids: Validators.arr('ids', payload['ids'], {
					isRequired: true,
					min: 1,
				}),
			});
			await this.registryService.clearResources();

			return true;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'traffic.create' })
	async create(payload) {
		try {
			const output = await this.trafficService.create({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				id: Validators.id('id', payload['id']),
				userId: Validators.id('userId', payload['userId']),
				servId: Validators.id('servId', payload['servId'], {
					isRequired: true,
				}),
				replica: Validators.str('replica', payload['replica'], {
					isRequired: true,
					min: 1,
					max: 255,
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

			await this.registryService.clearResources();

			return output;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}

	@MessagePattern({ cmd: 'traffic.update' })
	async update(payload) {
		try {
			await this.trafficService.update({
				user: Validators.token('accessToken', payload['accessToken'], {
					secret: process.env.JWT_SECRET_ACCESS_KEY,
					timeout: process.env.JWT_ACCESS_TIMEOUT,
					isRequired: true,
					role: {
						name: [ 'Admin' ],
					},
				}),
				id: Validators.id('id', payload['id']),
				newId: Validators.id('newId', payload['newId']),
				userId: Validators.id('userId', payload['userId']),
				servId: Validators.id('servId', payload['servId']),
				replica: Validators.str('replica', payload['replica']),
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
			await this.registryService.clearResources();

			return true;
		}
		catch (err) {
			this.logsService.emit(err);
			this.registryService.clearResources();

			return err;
		}
	}
}
