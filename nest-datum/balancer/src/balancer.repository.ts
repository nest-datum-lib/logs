import Redis from 'ioredis';
import getCurrentLine from 'get-current-line';
import { v4 as uuidv4 } from 'uuid';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ErrorException } from 'nest-datum/exceptions/src';
import { RedisRepository } from 'nest-datum/redis/src';

@Injectable()
export class BalancerRepository extends RedisRepository {
	static Schema = [
		'id',
		'projectId',
		'name',
		'transporter',
		'serviceResponsLoadingIndicator',
		'active',
		'restartsCompleted',
		'host',
		'port',
		'mysqlMasterHost',
		'mysqlMasterPort',
		'userRootEmail',
		'userRootLogin',
		'userRootPassword',
		'secretAccessKey',
		'secretRefreshKey',
		'createdAt',
		'updatedAt',
		'restartedAt',
	];

	static EntityName = 'replica';

	constructor(
		@InjectRedis(process['REDIS_BALANCER']) private readonly balancerRepository: Redis
	) {
		super(balancerRepository, BalancerRepository.EntityName, BalancerRepository.Schema);
	}

	async selectLessLoaded(payload: object) {
		let output;

		try {
			if (payload['id']
				&& typeof payload['id'] === 'string') {
				output = (await this.balancerRepository.hmget(`${process['PROJECT_ID']}|${BalancerRepository.EntityName}|id`, payload['id']))[0];
			}
			else {
				let id,
					lessLoaderId,
					lessLoader;

				console.log('1111');

				const allNamesData = await this.balancerRepository.hgetall(`${process['PROJECT_ID']}|${BalancerRepository.EntityName}|name`);

				console.log('222', allNamesData);

				const test00 = await this.balancerRepository.keys('*');

				console.log('test000000', test00);

				for (id in allNamesData) {
					if (payload['name']
						&& typeof payload['name'] === 'string'
						&& payload['name'] === allNamesData[id]) {
						const key = `${process['PROJECT_ID']}|${BalancerRepository.EntityName}|serviceResponsLoadingIndicator`;

						console.log('key, id', key, id);

						const test0 = await this.balancerRepository.hmget('c03e1167-bb9f-4047-a761-457ca283afdf|replica|name', 'cf9d4c59-b60f-4b55-ba6f-f0faebc46dd7');

						console.log('test0', test0);

						const test = await this.balancerRepository.hmget(key, id);
						const indicator = Number(test[0]);

						console.log('indicator', indicator);

						if (indicator === 0) {
							return await this.findOne(id);
						}
						if (lessLoader > indicator
							|| typeof lessLoader === 'undefined') {
							lessLoader = indicator;
							lessLoaderId = id;
						}
					}
				}
				if (!lessLoaderId) {
					return null;
				}
				output = await this.findOne(lessLoaderId);
			}
			return output;
		}
		catch (err) {
			console.error('Select replica:', err);
		}
	}
}
