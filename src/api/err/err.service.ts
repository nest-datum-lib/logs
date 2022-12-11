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
import { Err } from './err.entity';

@Injectable()
export class ErrService extends SqlService {
	constructor(
		@InjectRepository(Err) private readonly errRepository: Repository<Err>,
		private readonly connection: Connection,
		private readonly cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		userId: true,
		replicaId: true,
		replicaHost: true,
		replicaPort: true,
		serviceName: true,
		method: true,
		content: true,
		file: true,
		line: true,
		createdAt: true,
	};

	protected queryDefaultMany = {
		id: true,
		replicaHost: true,
		serviceName: true,
		method: true,
		file: true,
	};

	async many({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'err', 'many', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.errRepository.findAndCount(await this.findMany(payload));

			await this.cacheService.set([ 'err', 'many', payload ], output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		return [ [], 0 ];
	}

	async one({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'err', 'one', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.errRepository.findOne(await this.findOne(payload));
		
			if (output) {
				await this.cacheService.set([ 'err', 'one', payload ], output);
			}
			if (!output) {
				return new NotFoundException('Entity is undefined', getCurrentLine(), { user, ...payload });
			}
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
	}

	async drop({ user, ...payload }): Promise<any> {
		try {
			this.cacheService.clear([ 'err', 'many' ]);
			this.cacheService.clear([ 'err', 'one', payload ]);

			this.errRepository.delete({ id: payload['id'] });

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
			
			this.cacheService.clear([ 'err', 'many' ]);
			this.cacheService.clear([ 'err', 'one', payload ]);

			let i = 0;

			while (i < payload['ids'].length) {
				this.errRepository.delete({ id: payload['ids'][i] });
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
			await queryRunner.startTransaction();
			
			this.cacheService.clear([ 'err', 'many' ]);

			if (typeof payload['content'] === 'object') {
				payload['content'] = JSON.stringify(payload['content']);
			}
			const output = await this.errRepository.save({
				...payload,
				userId: user['id'] || payload['userId'] || '',
			});

			await queryRunner.commitTransaction();

			return output;
		}
		catch (err) {
			console.log('ERR CREATE ERROR', err);

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
			
			this.cacheService.clear([ 'err', 'many' ]);
			this.cacheService.clear([ 'err', 'one' ]);
			
			if (typeof payload['content'] === 'object') {
				payload['content'] = JSON.stringify(payload['content']);
			}
			await this.updateWithId(this.errRepository, payload);
			
			await queryRunner.commitTransaction();
			
			return true;
		}
		catch (err) {
			console.log('ERR UPDATE ERROR', err);

			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		finally {
			await queryRunner.release();
		}
	}
}
