import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const date = (propertyName: string, value, options = {}) => {
	if (value
		&& typeof value === 'string') {
		const date = new Date(value);

		if (date instanceof Date && !Number.isNaN(date)) {
			return date;
		}
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
