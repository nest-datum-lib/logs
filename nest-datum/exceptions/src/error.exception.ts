import { Exception } from './exception';

export class ErrorException extends Exception {
	public readonly command: string = 'err.create';
}