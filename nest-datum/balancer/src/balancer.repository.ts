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

		if (payload['id']
			&& typeof payload['id'] === 'string') {
			output = await this.balancerRepository.hmget(`${process['PROJECT_ID']}|${BalancerRepository.EntityName}|id`, payload['id']);
		}
		else {
			let lessLoaderId,
				lessLoader;
			const allNamesData = await this.balancerRepository.hgetall(`${process['PROJECT_ID']}|${BalancerRepository.EntityName}|name`);

			for (payload['id'] in allNamesData) {
				if (payload['name']
					&& typeof payload['name'] === 'string'
					&& payload['name'] === allNamesData[payload['id']]) {
					const indicator = Number(await this.balancerRepository.hmget(`${process['PROJECT_ID']}|${BalancerRepository.EntityName}|serviceResponsLoadingIndicator`, payload['id']));

					if (indicator === 0) {
						return await this.findOne(payload['id']);
					}
					if (lessLoader > indicator
						|| typeof lessLoader === 'undefined') {
						lessLoader = indicator;
						lessLoaderId = payload['id'];
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
}
