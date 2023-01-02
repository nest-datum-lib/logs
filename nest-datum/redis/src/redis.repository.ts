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
		const select = (payload || {})['select']
			? payload['select']
			: this.schema;
		let ids;

		if ((payload || {})['where']
			&& payload['where'] === 'object'
			&& !Array.isArray(payload['where'])) {
			let key,
				id,
				whereIds = [];

			for (key in payload['where']) {
				ids = await this.redisRepository.hgetall(`${process['PROJECT_ID']}|replica|${key}`);
				break;
			}
			if (!ids
				|| typeof ids !== 'object') {
				return [];
			}
			for (id in ids) {
				if (ids[id] === payload['where'][key]) {
					whereIds.push(id);
				}
			}
			ids = whereIds;
		}
		else {
			ids = await this.redisRepository.hgetall(`${process['PROJECT_ID']}|replica|id`);
		}
		let id,
			output = {};

		if (!ids
			|| typeof ids !== 'object') {
			return [];
		}
		let i = 0;

		while (i < select.length) {
			const values = await this.redisRepository.hgetall(`${process['PROJECT_ID']}|replica|${select[i]}`);

			for (id in values) {
				if (!output[id]) {
					output[id] = { id };
				}
				output[id][select[i]] = values[id];
			}
			i++;
		}
		return Object.values(output);
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
