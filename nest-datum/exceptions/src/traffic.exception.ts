import { Exception } from './exception';

export class TrafficException extends Exception {
	public readonly command: string = 'traffic.create';
	public readonly httpCode: number = 200;

	public data(): any {
		return {
			projectId: process['PROJECT_ID'],
			appId: process['APP_ID'],
			content: this.getMessage(),
			...(typeof this.payload === 'object'
				&& this.payload['host']
				&& typeof this.payload['host'] === 'string')
				? { host: this.payload['host'] }
				: {},
			...(typeof this.payload === 'object'
				&& this.payload['referrer']
				&& typeof this.payload['referrer'] === 'string')
				? { referrer: this.payload['referrer'] }
				: {},
			...(typeof this.payload === 'object'
				&& this.payload['originalUrl']
				&& typeof this.payload['originalUrl'] === 'string')
				? { 
					originalUrl: this.payload['originalUrl'],
					route: this.payload['originalUrl'], 
				}
				: {},
			...(typeof this.payload === 'object'
				&& this.payload['method']
				&& typeof this.payload['method'] === 'string')
				? { method: this.payload['method'] }
				: {},
			...(typeof this.payload === 'object'
				&& this.payload['ip']
				&& typeof this.payload['ip'] === 'string')
				? { ipAddr: this.payload['ip'] }
				: {},
			...(typeof this.payload === 'object'
				&& typeof this.payload['headers'] === 'object')
				? { headers: this.payload['headers'] }
				: {},
			...(typeof this.payload === 'object'
				&& typeof this.payload['queries'] === 'object')
				? { queries: this.payload['queries'] }
				: {},
			...(typeof this.payload === 'object'
				&& typeof this.payload['param'] === 'object')
				? { param: this.payload['param'] }
				: {},
			...(typeof this.payload === 'object'
				&& this.payload['body'])
				? { body: this.payload['body'] }
				: {},
			...(typeof this.payload === 'object'
				&& this.payload['cookies'])
				? { cookies: this.payload['cookies'] }
				: {},
		};
	}
}