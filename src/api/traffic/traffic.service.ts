import { v4 as uuidv4 } from 'uuid';
import getCurrentLine from 'get-current-line';
import { 
	Inject,
	Injectable, 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { SqlService } from 'nest-datum/sql/src';
import { CacheService } from 'nest-datum/cache/src';
import { 
	ErrorException,
	NotFoundException, 
} from 'nest-datum/exceptions/src';
import { Traffic } from './traffic.entity';

@Injectable()
export class TrafficService extends SqlService {
	constructor(
		@InjectRepository(Traffic) private readonly trafficRepository: Repository<Traffic>,
		private readonly connection: Connection,
		private readonly cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		userId: true,
		replicaId: true,
		ipAddr: true,
		referrer: true,
		method: true,
		route: true,
		headers: true,
		cookies: true,
		queries: true,
		body: true,
		createdAt: true,
	};

	protected queryDefaultMany = {
		id: true,
		ipAddr: true,
		referrer: true,
		method: true,
		route: true,
	};

	async many({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'traffic', 'many', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.trafficRepository.findAndCount(await this.findMany(payload));

			await this.cacheService.set([ 'traffic', 'many', payload ], output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		return [ [], 0 ];
	}

	async one({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'traffic', 'one', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.trafficRepository.findOne(await this.findOne(payload));
		
			await this.cacheService.set([ 'traffic', 'one', payload ], output);

			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
	}

	async drop({ user, ...payload }): Promise<any> {
		try {
			await this.cacheService.clear([ 'traffic', 'many' ]);
			await this.cacheService.clear([ 'traffic', 'one', payload ]);

			this.trafficRepository.delete({ id: payload['id'] });

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
	}

	async dropMany({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear([ 'traffic', 'many' ]);
			await this.cacheService.clear([ 'traffic', 'one', payload ]);

			let i = 0;

			while (i < payload['ids'].length) {
				this.trafficRepository.delete({ id: payload['ids'][i] });
				i++;
			}
			await queryRunner.commitTransaction();

			return true;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		finally {
			await queryRunner.release();
		}
	}

	async create({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			console.log('0000', payload);

			await queryRunner.startTransaction();
			await this.cacheService.clear([ 'traffic', 'many' ]);

			if (typeof payload['headers'] === 'object') {
				payload['headers'] = JSON.stringify(payload['headers']);
			}
			if (typeof payload['cookies'] === 'object') {
				payload['cookies'] = JSON.stringify(payload['cookies']);
			}
			if (typeof payload['body'] === 'object') {
				payload['body'] = JSON.stringify(payload['body']);
			}
			if (typeof payload['queries'] === 'object') {
				payload['queries'] = JSON.stringify(payload['queries']);
			}

			console.log('11111111111', payload);

			const output = await this.trafficRepository.save({
				...payload,
				userId: user['id'] || payload['userId'] || '',
			});

			console.log('22222', output);

			await queryRunner.commitTransaction();

			return output;
		}
		catch (err) {
			console.log('err', err);
			
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		finally {
			await queryRunner.release();
		}
	}

	async update({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear([ 'traffic', 'many' ]);
			await this.cacheService.clear([ 'traffic', 'one' ]);

			if (typeof payload['headers'] === 'object') {
				payload['headers'] = JSON.stringify(payload['headers']);
			}
			if (typeof payload['cookies'] === 'object') {
				payload['cookies'] = JSON.stringify(payload['cookies']);
			}
			if (typeof payload['body'] === 'object') {
				payload['body'] = JSON.stringify(payload['body']);
			}
			if (typeof payload['queries'] === 'object') {
				payload['queries'] = JSON.stringify(payload['queries']);
			}
			
			await this.updateWithId(this.trafficRepository, payload);
			
			await queryRunner.commitTransaction();
			
			return true;
		}
		catch (err) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		finally {
			await queryRunner.release();
		}
	}
}
