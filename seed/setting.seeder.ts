import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { Promise as Bluebird } from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import { Setting } from 'src/api/setting/setting.entity';

export class SettingSeeder {
	constructor(
		private readonly connection: Connection,
		@InjectRepository(Setting) private readonly settingRepository: Repository<Setting>,
	) {
	}

	async send() {
		const queryRunner = await this.connection.createQueryRunner(); 

		try {
			// new transaction
			await queryRunner.startTransaction();
			await Bluebird.each([{
				id: 'logs-setting-service-id',
				name: 'Service id',
				description: 'Service id in redis.',
				dataTypeId: 'data-type-type-text',
				value: process.env.SERVICE_ID || 'files1',
				isNotDelete: true,
			}, {
				id: 'logs-setting-transport-provider',
				name: 'Transport provider',
				description: 'The name of the protocol for transporting data between services.',
				dataTypeId: 'data-type-type-text',
				value: process.env.TRANSPORT_PROVIDER,
				isNotDelete: true,
			}, {
				id: 'logs-setting-transport-host',
				name: 'Service host',
				description: 'Service IP address.',
				dataTypeId: 'data-type-type-text',
				value: process.env.TRANSPORT_HOST,
				isNotDelete: true,
			}, {
				id: 'logs-setting-transport-port',
				name: 'Service port',
				description: 'Service port.',
				dataTypeId: 'data-type-type-integer',
				value: process.env.TRANSPORT_PORT,
				isNotDelete: true,
			}, {
				id: 'logs-setting-cache-namespace',
				name: 'Cache namespace',
				description: 'Cache namespace.',
				dataTypeId: 'data-type-type-text',
				value: process.env.REDIS_CACHE_NAMESPACE,
				isNotDelete: true,
			}, {
				id: 'logs-setting-cache-host',
				name: 'Cache host',
				description: 'Cache IP address.',
				dataTypeId: 'data-type-type-text',
				value: process.env.REDIS_CACHE_HOST,
				isNotDelete: true,
			}, {
				id: 'logs-setting-cache-port',
				name: 'Cache port',
				description: 'Cache port.',
				dataTypeId: 'data-type-type-integer',
				value: process.env.REDIS_CACHE_PORT,
				isNotDelete: true,
			}, {
				id: 'logs-setting-cache-db',
				name: 'Cache db',
				description: 'Redis database number.',
				dataTypeId: 'data-type-type-integer',
				value: process.env.REDIS_CACHE_DB,
				isNotDelete: true,
			}, {
				id: 'logs-setting-cache-password',
				name: 'Cache password',
				description: 'Redis database password.',
				dataTypeId: 'data-type-type-text',
				value: process.env.REDIS_CACHE_PASSWORD,
				isNotDelete: true,
			}], async (data) => {
				try {
					await this.settingRepository.insert(data);
				}
				catch (err) {
					await queryRunner.rollbackTransaction();

					console.error(`ERROR: setting 2: ${err.message}`);
				}
			});
			await queryRunner.commitTransaction();
		}
		catch (err) {
			await queryRunner.rollbackTransaction();

			console.error(`ERROR: setting 1: ${err.message}`);
		}
		finally {
			await queryRunner.release();
		}
	}
}