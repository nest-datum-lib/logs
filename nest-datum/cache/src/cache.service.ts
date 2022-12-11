import getCurrentLine from 'get-current-line';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ErrorException } from 'nest-datum/exceptions/src';

const timeouts = {};
const tmp = {};

@Injectable()
export class CacheService {
	constructor(
		@InjectRedis(process['REDIS_CACHE']) private readonly redisCache: Redis,
	) {
	}

	buildKey(query: Array<any>): string {
		let key = `${process['PROJECT_ID']}|`,
			i = 0;

		while (i < query.length) {
			if (!query[i]) {
				throw new ErrorException(`Cache query item is undefined.`, getCurrentLine(), { i, query });
			}
			key += (query[i]
				&& typeof query[i] === 'object')
				? JSON.stringify(query[i])
				: query[i].toString();

			if (i < (query.length - 1)) {
				key += '|';
			}
			i++;
		}
		return key;
	}

	async get(query: Array<any>): Promise<any> {
		let output;

		try {
			const key = this.buildKey(query);
			
			output = tmp[key]
				? undefined
				: await this.redisCache.get(key);
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { query });
		}

		if (output
			&& typeof output === 'string') {
			try {
				const outputParsed = JSON.parse(output);

				output = outputParsed;
			}
			catch (err) {
			}
		}
		return output;
	}

	async set(query: Array<any>, payload = undefined): Promise<any> {
		try {
			const key = this.buildKey(query);
			
			return await this.redisCache.set(key, (payload
				&& typeof payload === 'object')
				? JSON.stringify(payload)
				: (payload || '').toString());
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { query, payload });
		}
	}

	async clear(query: Array<any>): Promise<any> {
		try {
			const key = this.buildKey(query);
			const cacheDataByKey = Number(await this.redisCache.exists(key));

			tmp[key] = true;

			if (cacheDataByKey) {
				await this.redisCache.del(key);
			}
			else {
				await (new Promise(async (resolve, reject) => {
					let scanStream; 
					
					try {
						scanStream = await this.redisCache.scanStream({
							match: `${key}*`,
							count: 64,
						});
					}
					catch (err) {
						return reject(err);
					}

					scanStream.on('data', async (resultKeys) => {
						let i = 0;

						while (i < resultKeys.length) {
							try {
								await this.redisCache.del(resultKeys[i]);
							}
							catch (err) {
								console.error(`cache service delete: ${resultKeys[i]} ${err}.`);
								
								return reject(err);
							}
							i++;
						}
					});
					scanStream.on('end', () => {
						return resolve(true);
					});
				}));
			}
			clearTimeout(timeouts[key]);

			timeouts[key] = setTimeout(() => {
				delete timeouts[key];
				delete tmp[key];
			}, 1000);

			return true;
		}
		catch (err) {
			throw new ErrorException(err.message, getCurrentLine(), { query });
		}
	}
}
