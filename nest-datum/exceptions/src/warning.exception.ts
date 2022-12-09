import { Exception } from './exception';

export class WarningException extends Exception {
	public readonly command: string = 'warning.create';
	public readonly httpCode: number = 403;
}