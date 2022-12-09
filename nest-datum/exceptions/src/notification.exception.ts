import { Exception } from './exception';

export class NotificationException extends Exception {
	public readonly command: string = 'notification.create';
	public readonly httpCode: number = 200;

	constructor(
		public message: string,
		public readonly options,
	) {
		super(message, options, {});
	}

	public data(): any {
		return {
			projectId: process['PROJECT_ID'],
			appId: process['APP_ID'],
			userId: (this.payload['userId'] = (typeof this.payload['user'] === 'object'
				&& this.payload['user']['id'])
				? this.payload['user']['id']
				: (this.payload['userId']
					? this.payload['userId']
					: '')),
			action: (this.options['method']
				&& typeof this.options['method'] === 'string')
				? this.options['method']
				: this.getMessage(),
			content: this.getMessage(),
		};
	}
}