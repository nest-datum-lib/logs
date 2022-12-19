import Redis from 'ioredis';
import getCurrentLine from 'get-current-line';
import { v4 as uuidv4 } from 'uuid';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
	Injectable,
	Inject,
	Logger,
} from '@nestjs/common';
import { 
	ClientProxyFactory,
	Transport, 
} from '@nestjs/microservices';
import { 
	Exception,
	ErrorException,
	NotFoundException, 
	WarningException,
	NotificationException,
} from 'nest-datum/exceptions/src';
import { setEnvValue } from 'nest-datum/common/src';
import { generateAccessToken } from 'nest-datum/jwt/src';
import { BalancerRepository } from './balancer.repository';

const _clients = {};

@Injectable()
export class BalancerService {
	constructor(
		private readonly balancerRepository: BalancerRepository,
	) {
	}

	protected async transporterConnected(transporter, replicaId: string, serviceResponsLoadingIndicator = 0): Promise<boolean> {
		try {
			const transportTimeout = parseInt(process.env.APP_TRANSPORT_TIMEOUT);
			const transporterAttempts = parseInt(process.env.APP_TRANSPORT_ATTEMPTS);
			const transportTimeoutNum = (typeof transportTimeout === 'number'
				&& transportTimeout > 0)
				? transportTimeout
				: 200;
			const transporterAttemptsNum = (typeof transporterAttempts === 'number'
				&& transporterAttempts > 0)
				? transporterAttempts
				: 10;
			let interval,
				index = 0;

			if (!transporter['isConnected']) {
				await (new Promise((resolve, reject) => {
					interval = setInterval(() => {
						if (transporter
							&& transporter['isConnected']) {
							clearInterval(interval);
							resolve(true);
							return;
						}
						else if (index >= transporterAttemptsNum) {
							clearInterval(interval);
							console.log('transporterConnected replicaId', replicaId);
							reject(new Error(`Service "${replicaId}" is unavailable`));
							return;
						}
						index += 1;
					}, transportTimeoutNum);
				}));
			}
			await this.balancerRepository.update(replicaId, {
				serviceResponsLoadingIndicator: Number(serviceResponsLoadingIndicator) + 1,
			});

			return true;
		}
		catch (err) {
			console.error(err);

			delete _clients[replicaId];

			this.balancerRepository.update(replicaId, {
				active: false,
			});
		}
		return false;
	}

	public async decrementServiceResponseLoadingIndicator(id = process['APP_ID']): Promise<any> {
		try {
			const replica = await this.balancerRepository.findOne(id, [
				'id',
				'serviceResponsLoadingIndicator',
			]);
			const indicator = Number(replica['serviceResponsLoadingIndicator']);

			await this.balancerRepository.update(id, {
				serviceResponsLoadingIndicator: (indicator <= 0)
					? 0
					: (indicator - 1),
			});
		}
		catch (err) {
			console.error(err);

			this.log(new ErrorException(err.message, getCurrentLine(), { replicaId: id }));
		}
	}

	protected getTransporter(replica: object): any {
		let transporter = _clients[replica['id']];

		if (!transporter
			&& replica['host']
			&& replica['port']) {
			const transporterName = (replica['transporter']
				&& typeof replica['transporter'] === 'string')
				? replica['transporter']
				: 'TCP';

			transporter = ClientProxyFactory.create({
				transport: Transport[transporterName],
				options: {
					host: replica['host'],
					port: Number(replica['port']),
				},
			});
			_clients[replica['id']] = transporter;

			transporter.connect();
		}
		return transporter;
	}

	async log(exception) {
		if (!exception
			|| typeof exception !== 'object'
			|| typeof exception['cmd'] !== 'function'
			|| typeof exception['data'] !== 'function') {
			console.error(exception);
			return;
		}

		const replica =  await this.balancerRepository.selectLessLoaded({
			name: 'logs',
		});
		if (replica
			&& typeof replica === 'object') {
			const transporter = this.getTransporter(replica);

			if (transporter
				&& await this.transporterConnected(transporter, replica['id'], replica['serviceResponsLoadingIndicator'])) {
				const accessToken = generateAccessToken({
					id: 'sso-user-admin',
					roleId: 'sso-role-admin',
					email: process['USER_ROOT_EMAIL'],
				}, Date.now());
				const cmd = exception.cmd();
				const data = exception.data();

				transporter.emit(cmd, {
					...data,
					accessToken, 
				});
			}
		}
	}

	async send(query, payload: any): Promise<any> {
		const {
			cmd,
			name,
			id,
		} = query;
		const replica =  await this.balancerRepository.selectLessLoaded({
			id,
			name,
		});

		if (!replica) {
			throw new NotFoundException(`Service replica ${name} not found`, getCurrentLine(), { name, cmd, payload });
		}
		const transporter = this.getTransporter(replica);

		if (transporter
			&& await this.transporterConnected(transporter, replica['id'], replica['serviceResponsLoadingIndicator'])) {
			if (cmd.includes('.create')
				&& typeof payload === 'object'
				&& (typeof payload['id'] !== 'string'
					|| !payload['id'])) {
				payload['id'] = uuidv4();
			}
			if (cmd.includes('.create')
				|| cmd.includes('.update')
				|| cmd.includes('.drop')) {
				transporter.emit(cmd, { ...payload });
			}
			else {
				const response = await lastValueFrom(transporter
					.send({ cmd }, payload)
					.pipe(map(response => response)));

				if (response
					&& typeof response === 'object'
					&& response['httpCode']) {
					switch (response['httpCode'].toString()) {
						case '404':
							throw new NotFoundException(response['message'], getCurrentLine(), { name, cmd, payload });
						case '403':
							throw new WarningException(response['message'], getCurrentLine(), { name, cmd, payload });
						default:
							throw new ErrorException(response['message'], getCurrentLine(), { name, cmd, payload });
					}
				}
				else if (!response) {
					throw new NotFoundException('Resource not found.', getCurrentLine(), { name, cmd, payload });
				}
				return response;
			}
			if (payload
				&& typeof payload === 'object') {
				delete payload['accessToken'];
				delete payload['refreshToken'];
			}
			return payload;
		}
		throw new NotFoundException(`Service not found.`, getCurrentLine(), { name, cmd, payload });
	}

	async registry(user?: object): Promise<any> {
		try {
			if (user
				&& user['email']
				&& user['login']
				&& user['password']
				&& !process['PROJECT_ID']
					|| !process['JWT_SECRET_ACCESS_KEY']
					|| !process['JWT_SECRET_REFRESH_KEY']) {
				const replicas = await this.balancerRepository.find({
					select: [
						'id',
						'secretAccessKey',
						'secretRefreshKey',
						'userRootEmail',
						'userRootLogin',
						'userRootPassword',
					],
					where: {
						name: 'registry',
					},
				});
				let i = 0;

				while (i < replicas.length) {
					if (replicas[i]['userRootEmail'] !== user['email']
						|| replicas[i]['userRootLogin'] !== user['login']
						|| replicas[i]['userRootPassword'] !== user['password']) {
						return false;
					}
					i++;
				}
				i = 0;

				while (i < replicas.length) {
					process['PROJECT_ID'] = replicas[i]['projectId'];
					process['JWT_SECRET_ACCESS_KEY'] = replicas[i]['secretAccessKey'];
					process['JWT_SECRET_REFRESH_KEY'] = replicas[i]['secretRefreshKey'];

					await this.balancerRepository.create({
						projectId: replicas[i]['projectId'],
						id: process['APP_ID'],
						name: process.env.APP_NAME,
						transporter: process.env.APP_TRANSPORTER,
						serviceResponsLoadingIndicator: 0,
						active: true,
						restartsCompleted: 0,
						host: process.env.APP_HOST,
						port: Number(process.env.APP_PORT),
						mysqlMasterHost: process.env.MYSQL_MASTER_HOST,
						mysqlMasterPort: Number(process.env.MYSQL_MASTER_PORT),
						userRootEmail: process['USER_ROOT_EMAIL'],
						userRootLogin: process['USER_ROOT_LOGIN'],
						userRootPassword: process['USER_ROOT_PASSWORD'],
						secretAccessKey: replicas[i]['secretAccessKey'],
						secretRefreshKey: replicas[i]['secretRefreshKey'],
						createdAt: new Date(),
						updatedAt: undefined,
						restartedAt: undefined,
					});
					await this.log(new NotificationException(`Replica "${process['APP_ID']}|${process.env.APP_HOST}:${process.env.APP_PORT}" for "${process.env.APP_NAME}" service has registered in redis.`, {
						...process,
						method: 'Replica register',
					}));				
					i++;
				}
			}
			else {
				await this.balancerRepository.create({
					projectId: process['PROJECT_ID'],
					id: process['APP_ID'],
					name: process.env.APP_NAME,
					transporter: process.env.APP_TRANSPORTER,
					serviceResponsLoadingIndicator: 0,
					active: true,
					restartsCompleted: 0,
					host: process.env.APP_HOST,
					port: Number(process.env.APP_PORT),
					mysqlMasterHost: process.env.MYSQL_MASTER_HOST,
					mysqlMasterPort: Number(process.env.MYSQL_MASTER_PORT),
					userRootEmail: process['USER_ROOT_EMAIL'],
					userRootLogin: process['USER_ROOT_LOGIN'],
					userRootPassword: process['USER_ROOT_PASSWORD'],
					secretAccessKey: process['JWT_SECRET_ACCESS_KEY'],
					secretRefreshKey: process['JWT_SECRET_REFRESH_KEY'],
					createdAt: new Date(),
					updatedAt: undefined,
					restartedAt: undefined,
				});
				await this.log(new NotificationException(`Replica "${process['APP_ID']}|${process.env.APP_HOST}:${process.env.APP_PORT}" for "${process.env.APP_NAME}" service has registered in redis.`, {
					...process,
					method: 'Replica register',
				}));
			}
			setEnvValue('PROJECT_ID', process['PROJECT_ID']);
			setEnvValue('APP_ID', process['APP_ID']);
			setEnvValue('JWT_SECRET_ACCESS_KEY', process['JWT_SECRET_ACCESS_KEY']);
			setEnvValue('JWT_SECRET_REFRESH_KEY', process['JWT_SECRET_REFRESH_KEY']);

			console.log("\n");
			console.log('Project ID:', process['PROJECT_ID']);
			console.log('App ID:', process['APP_ID'], "\n");

			return true;
		}
		catch (err) {
			console.error(err);

			this.log(new ErrorException(err.message, getCurrentLine(), { replicaId: process['APP_ID'] }));
			return false;
		}
	}
}
