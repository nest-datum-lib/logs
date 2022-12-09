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

				const allNamesData = await this.balancerRepository.hgetall(`${process['PROJECT_ID']}|${BalancerRepository.EntityName}|name`);

				for (id in allNamesData) {
					if (payload['name']
						&& typeof payload['name'] === 'string'
						&& payload['name'] === allNamesData[id]) {
						const key = `${process['PROJECT_ID']}|${BalancerRepository.EntityName}|serviceResponsLoadingIndicator`;
						const indicator = Number((await this.balancerRepository.hmget(key, id))[0]);

						if (id !== process['APP_ID']) {
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
