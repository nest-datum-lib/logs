import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const files = (propertyName: string, value, options = {}) => {
	if (typeof value !== 'undefined') {
		if (!Array.isArray(value)) {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
		}
		return value;
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
