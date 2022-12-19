import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

const timeout = {
	exists: false,
	loop: () => {},
	processors: [],
};

export class QueueService {
	/**
	 * The total number of attempts to try the job until it completes.
	 * @type {number}
	 */
	public attempts = 3;

	/**
	 * An amount of time (milliseconds) to wait until this job can be processed. Note that for accurate delays, both server and clients should have their clocks synchronized.
	 * @type {number}
	 */
	public delay = 0;

	/**
	 * The number of milliseconds after which the job should fail with a timeout error.
	 * @type {number}
	 */
	public timeout = 0;

	constructor(
		private readonly redisQueue: Redis,
	) {
	}

	async callback (payload, currentTime): Promise<any> {
		return null;
	}

	async taskProcess() {
		return async (currentTime: Date) => {
			const task = await this.redisQueue.lindex(this.constructor.name, 0);
			let taskData;

			if (task
				&& typeof task === 'string') {
				try {
					taskData = JSON.parse(task);
				}
				catch (err) {
					console.error(`Invalid task format in redis queue ("${task.toString()}").`);

					return;
				}

				try {
					this.redisQueue.lrem(this.constructor.name, 1, task);

					if (taskData['attempts'] !== this.attempts) {
						taskData['attempts'] = (this.attempts >= 1)
							? this.attempts
							: 1;
					}
					if (!(taskData['currentAttempt'] >= 0)) {
						taskData['currentAttempt'] = 0;
					}
					return await this.callback(taskData, currentTime);
				}
				catch (err) {
					taskData['currentAttempt'] += 1;
					taskData['repeatedAt'] = new Date();

					if (taskData['currentAttempt'] < taskData['attempts']) {
						try {
							await this.redisQueue.rpush(this.constructor.name, JSON.stringify(taskData));
						}
						catch (err) {
							console.error('Increase attempt value in queue error', err);
						}
					}
				}
			}

			return;
		};
	}

	async listen() {
		this.addToLoop(await this.taskProcess());
	}

	async addToLoop(callbackFunc: Function): Promise<any> {
		timeout['processors'].push(callbackFunc);

		if (!timeout['exists']) {
			timeout['exists'] = true;
			timeout['loop'] = async () => {
				let i = 0;

				while (i < timeout['processors'].length) {
					const processor = timeout['processors'][i];

					await processor(new Date());
					i++;
				}
				await (new Promise((resolve, reject) => setTimeout(() => resolve(true), 0)));
				await timeout['loop']();
			};

			await timeout['loop']();
		}
	}

	async task(payload: object): Promise<any> {
		try {
			if (!payload
				|| typeof payload !== 'object') {
				throw new Error(`Task properties "${payload.toString()}" is invalid format.`);
			}
			payload['id'] = uuidv4();
			payload['attempts'] = (payload['attempts'] >= 1)
				? payload['attempts']
				: this.attempts;
			payload['currentAttempt'] = 0;
			payload['delay'] = (payload['delay'] >= 0)
				? payload['delay']
				: this.delay;
			payload['timeout'] = (payload['timeout'] >= 0)
				? payload['timeout']
				: this.timeout;
			payload['createdAt'] = new Date();

			await this.redisQueue.rpush(this.constructor.name, JSON.stringify(payload));
		}
		catch (err) {
			throw new Error(err.message);
		}
	}
}
