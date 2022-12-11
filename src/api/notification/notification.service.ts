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
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService extends SqlService {
	constructor(
		@InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>,
		private readonly connection: Connection,
		private readonly cacheService: CacheService,
	) {
		super();
	}

	protected selectDefaultMany = {
		id: true,
		userId: true,
		replicaId: true,
		action: true,
		content: true,
		createdAt: true,
	};

	protected queryDefaultMany = {
		id: true,
		action: true,
	};

	async many({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'notification', 'many', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.notificationRepository.findAndCount(await this.findMany(payload));

			await this.cacheService.set([ 'notification', 'many', payload ], output);
			
			return output;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { user, ...payload });
		}
		return [ [], 0 ];
	}

	async one({ user, ...payload }): Promise<any> {
		try {
			const cachedData = await this.cacheService.get([ 'notification', 'one', payload ]);

			if (cachedData) {
				return cachedData;
			}
			const output = await this.notificationRepository.findOne(await this.findOne(payload));
		
			if (output) {
				await this.cacheService.set([ 'notification', 'one', payload ], output);
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
			this.cacheService.clear([ 'notification', 'many' ]);
			this.cacheService.clear([ 'notification', 'one', payload ]);

			this.notificationRepository.delete({ id: payload['id'] });

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
			
			this.cacheService.clear([ 'notification', 'many' ]);
			this.cacheService.clear([ 'notification', 'one', payload ]);

			let i = 0;

			while (i < payload['ids'].length) {
				this.notificationRepository.delete({ id: payload['ids'][i] });
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
			
			this.cacheService.clear([ 'notification', 'many' ]);

			if (typeof payload['content'] === 'object') {
				payload['content'] = JSON.stringify(payload['content']);
			}

			const output = await this.notificationRepository.save({
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
			
			this.cacheService.clear([ 'notification', 'many' ]);
			this.cacheService.clear([ 'notification', 'one' ]);
			
			if (typeof payload['content'] === 'object') {
				payload['content'] = JSON.stringify(payload['content']);
			}

			await this.updateWithId(this.notificationRepository, payload);
			
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
