import getCurrentLine from 'get-current-line';
import { v4 as uuidv4 } from 'uuid';
import { ErrorException } from 'nest-datum/exceptions/src';

export class RedisRepository {
	constructor(
		public readonly redisRepository,
		public readonly entityName,
		public readonly schema,
	) {
	}

	async scan(match: string, count: number = 64) {
		return await (new Promise(async (resolve, reject) => {
			let scanStream,
				output = []; 
					
			try {
				scanStream = await this.redisRepository.scanStream({
					match,
					count,
				});
			}
			catch (err) {
				return reject(err);
			}

			scanStream.on('data', async (resultKeys) => {
				let i = 0;

				while (i < resultKeys.length) {
					output.push(resultKeys[i]);
					i++;
				}
			});
			scanStream.on('end', () => {
				scanStream = undefined;

				return resolve(output);
			});
		}));
	}

	async find(payload?: object): Promise<any> {
		if (payload
			&& typeof payload === 'object'
			&& payload['where']
			&& typeof payload['where'] === 'object') {
			let keyWhere,
				projectId,
				output = {};

			for (keyWhere in payload['where']) {
				const keys = await this.scan(`*|${this.entityName}|${keyWhere}`, 64);
				let i = 0;

				while (i < (keys['length'] || 0)) {
					const replicas = await this.redisRepository.hgetall(keys[i]);
					const replicasIds = Object
						.keys(replicas)
						.filter((id) => replicas[id] === payload['where'][keyWhere]);
					const keySplit = keys[i].split('|');
					const select = Array.isArray(payload['select'])
						? payload['select']
						: this.schema;
					let ii = 0;

					projectId = keySplit[0];
					
					while (ii < replicasIds.length) {
						let iii = 0;

						while (iii < select.length) {
							const value = await this.redisRepository.hgetall(`${projectId}|${this.entityName}|${select[iii]}`);
							let id;

							for (id in value) {
								if (!output[replicasIds[ii]]) {
									output[replicasIds[ii]] = {
										id: replicasIds[ii],
										projectId,
									};
								}
								output[replicasIds[ii]][select[iii]] = value[id];
							}
							iii++;
						}
						ii++;
					}
					i++;
				}
				break;
			}
			return Object.values(output);
		}
		else {
			let allIdsData = {};

			try {
				allIdsData = await this.redisRepository.hgetall(`${process['PROJECT_ID']}|${this.entityName}|id`);
			}
			catch (err) {
				console.error(err);

				throw new ErrorException(err.message, getCurrentLine(), { entityName: this.entityName });
			}

			let id,
				i,
				item,
				output = [];
			const schema = this.schema.filter((item) => item !== 'restartsCompleted'
				&& item !== 'userRootEmail'
				&& item !== 'userRootLogin'
				&& item !== 'userRootPassword'
				&& item !== 'secretAccessKey'
				&& item !== 'secretRefreshKey');

			for (id in allIdsData) {
				i = 0;
				item = {};

				while (i < schema.length) {
					try {
						item[schema[i]] = (await this.redisRepository.hmget(`${process['PROJECT_ID']}|${this.entityName}|${schema[i]}`, id))[0];
					}
					catch (err) {
						console.error(err);

						throw new ErrorException(err.message, getCurrentLine(), { id, i, key: schema[i] });
					}
					i++;
				}
				output.push({ ...item });
			}
			return output;
		}
	}

	async findOne(id: string, select?: Array<any>): Promise<any> {
		let i = 0,
			output = {};
		const schema = ((select || []).length > 0)
			? select
			: this.schema;

		while (i < schema.length) {
			try {
				output[schema[i]] = (await this.redisRepository.hmget(`${process['PROJECT_ID']}|${this.entityName}|${schema[i]}`, id))[0];
			}
			catch (err) {
				console.error(err);

				throw new ErrorException(err.message, getCurrentLine(), { id, i, key: schema[i] });
			}
			i++;
		}
		return Object.keys(output).length > 0
			? output
			: null;
	}

	async delete(id: string): Promise<any> {
		let i = 0;

		while (i < this.schema.length) {
			try {
				await this.redisRepository.hdel(`${process['PROJECT_ID']}|${this.entityName}|${this.schema[i]}`, id);
			}
			catch (err) {
				console.error(err);

				throw new ErrorException(err.message, getCurrentLine(), { id, i, key: this.schema[i] });
			}
			i++;
		}
		return true;
	}

	async create(payload: object): Promise<any> {
		const id = (typeof payload['id'] === 'string'
			&& payload['id'].length >= 1
			&& payload['id'].length <= 64)
			? payload['id']
			: uuidv4();
		let i = 0;

		payload['id'] = id;

		while (i < this.schema.length) {
			try {
				await this.redisRepository.hmset(`${process['PROJECT_ID']}|${this.entityName}|${this.schema[i]}`, id, payload[this.schema[i]]);
			}
			catch (err) {
				console.error(err);

				throw new ErrorException(err.message, getCurrentLine(), { id, key: this.schema[i], payload });
			}
			i++;
		}
		return payload;
	}

	async update(id: string, payload: object): Promise<any> {
		let key;

		for (key in payload) {
			try {
				await this.redisRepository.hset(`${process['PROJECT_ID']}|${this.entityName}|${key}`, id, payload[key].toString());
			}
			catch (err) {
				console.error(err);
				
				throw new ErrorException(err.message, getCurrentLine(), { id, key, payload });
			}
		}
		return true;
	}
}
