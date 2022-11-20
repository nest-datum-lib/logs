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
import { Warning } from './warning.entity';

@Injectable()
export class WarningService extends MysqlService {
	constructor(
		@InjectRepository(Warning) private readonly warningRepository: Repository<Warning>,
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
		method: true,
		content: true,
		file: true,
		line: true,
		createdAt: true,
	};

	protected queryDefaultMany = {
		id: true,
		replica: true,
		method: true,
		file: true,
	};

	async many(payload): Promise<any> {
		try {
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.warning.many`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.warningRepository.findAndCount(await this.findMany(payload));

			await this.cacheService.set(`${process.env.APP_ID}.warning.many`, payload, output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
		return [ [], 0 ];
	}

	async one(payload): Promise<any> {
		try {
			const cachedData = await this.cacheService.get(`${process.env.APP_ID}.warning.one`, payload);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.warningRepository.findOne(await this.findOne(payload));
		
			await this.cacheService.set(`${process.env.APP_ID}.warning.one`, payload, output);

			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), payload);
		}
	}

	async drop(payload): Promise<any> {
		try {
			await this.cacheService.clear(`${process.env.APP_ID}.warning.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.warning.one`, payload);

			this.warningRepository.delete({ id: payload['id'] });

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
			await this.cacheService.clear(`${process.env.APP_ID}.warning.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.warning.one`, payload);

			let i = 0;

			while (i < payload['ids'].length) {
				this.warningRepository.delete({ id: payload['ids'][i] });
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
			await this.cacheService.clear(`${process.env.APP_ID}.warning.many`);

			if (typeof payload['content'] === 'object') {
				payload['content'] = JSON.stringify(payload['content']);
			}

			const output = await this.warningRepository.save({
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
			await this.cacheService.clear(`${process.env.APP_ID}.warning.many`);
			await this.cacheService.clear(`${process.env.APP_ID}.warning.one`);
			
			if (typeof payload['content'] === 'object') {
				payload['content'] = JSON.stringify(payload['content']);
			}
			
			await this.updateWithId(this.warningRepository, {
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
