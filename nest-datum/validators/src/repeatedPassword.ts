import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const repeatedPassword = (propertyName: string, value, options = {}) => {
	if (typeof value !== 'undefined') {
		if (typeof value !== 'string') {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
		}
		if (value !== options['value']) {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}value do not match with "repeatedPassword" value.`, getCurrentLine(), { value, ...options });
		}
		return value;
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
