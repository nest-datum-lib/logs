import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';
import { str } from './str';

export const fileName = (propertyName: string, value, options = {}) => {
	if (typeof value !== 'undefined') {
		const valueStr = str(propertyName, value, {
			min: 1,
			max: 255,
			...options,
		});

		if (valueStr.includes('/')
			|| valueStr[0] === '.') {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}contains invalid characters.`, getCurrentLine(), { value, ...options });
		}
		return value;

	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
