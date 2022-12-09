import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const language = (propertyName: string, value, options = {}) => {
	if (typeof value !== 'undefined') {
		if (!value
			|| typeof value !== 'string') {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is not language type.`, getCurrentLine(), { value, ...options });
		}
		return value || 'en';
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}

	return value || 'en';
};
