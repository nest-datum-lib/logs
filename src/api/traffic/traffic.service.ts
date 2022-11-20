import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import getCurrentLine from 'get-current-line';
import { 
	Inject,
	Injectable, 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { 
	MysqlService,
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { ErrorException } from '@nest-datum/exceptions';
import { Traffic } from './traffic.entity';

@Injectable()
export class TrafficService extends MysqlService {
	constructor(
		@InjectRepository(Traffic) private readonly trafficRepository: Repository<Traffic>,
		private readonly connection: Connection,
		private readonly registryService: RegistryService,
		private readonly logsService: LogsService,
		private readonly cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		userId: true,
		servId: true,
		replica: true,
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
		replica: true,
		ipAddr: true,
		referrer: true,
		method: true,
		route: true,
	};

	async many(payload): Promise<any> {
		try {
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.traffic.many`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.trafficRepository.findAndCount(await this.findMany(payload));

			await this.cacheService.set(`${process.env.APP_ID}.traffic.many`, payload, output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
		return [ [], 0 ];
	}

	async one(payload): Promise<any> {
		try {
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.traffic.one`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.trafficRepository.findOne(await this.findOne(payload));
		
			await this.cacheService.set(`${process.env.APP_ID}.traffic.one`, payload, output);

			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	}

	async drop(payload): Promise<any> {
		try {
			await this.cacheService.clear(`${process.env.APP_ID}.traffic.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.traffic.one`, payload);

			this.trafficRepository.delete({ id: payload['id'] });

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	}

	async dropMany(payload): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.traffic.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.traffic.one`, payload);

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

			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
		finally {
			await queryRunner.release();
		}
	}

	async create({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.traffic.many`);

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

			const output = await this.trafficRepository.save({
				...payload,
				userId: user['id'] || payload['userId'] || '',
			});

			await queryRunner.commitTransaction();

			return output;
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

	async update({ user, ...payload }): Promise<any> {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			await queryRunner.startTransaction();
			await this.cacheService.clear(`${process.env.APP_ID}.traffic.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.traffic.one`);

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
			
			await this.updateWithId(this.trafficRepository, {
				...payload,
				userId: user['id'] || payload['userId'] || '',
			});
			
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
