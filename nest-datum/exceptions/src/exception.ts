
export class Exception {
	public readonly command: string = 'err.create';
	public readonly httpCode: number = 500;
	public userId: string;

	constructor(
		public message: string,
		public readonly options,
		public readonly payload: any,
	) {
	}

	public cmd(): string {
		return this.command;
	}

	public getMessage(): string {
		return this.message;
	}

	public data(): any {
		return {
			projectId: process['PROJECT_ID'],
			appId: process['APP_ID'],
			appName: process.env.APP_NAME,
			appHost: process.env.APP_HOST,
			appPort: process.env.APP_PORT,
			appTrasnporter: process.env.APP_TRANSPORTER,
			appTransportTimeout: process.env.APP_TRANSPORT_TIMEOUT,
			appTransportAttempts: process.env.APP_TRANSPORT_ATTEMPTS,
			userId: (this.payload['userId'] = (typeof this.payload['user'] === 'object'
				&& this.payload['user']['id'])
				? this.payload['user']['id']
				: (this.payload['userId']
					? this.payload['userId']
					: '')),
			method: (this.options['method']
				&& typeof this.options['method'] === 'string')
				? this.options['method']
				: '',
			file: (typeof this.options['file']
				&& this.options['file'] === 'string')
				? this.options['file']
				: '',
			line: (this.options['line'] >= 0)
				? this.options['line']
				: 0,
			content: this.getMessage(),
		};
	}
}
