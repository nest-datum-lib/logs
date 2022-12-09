import { Exception } from './exception';

export class NotFoundException extends Exception {
	public readonly command: string = 'warning.create';
	public readonly httpCode: number = 404;
}