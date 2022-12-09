import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const objOrArr = (propertyName: string, value, options = {}) => {
	if (value
		&& typeof value === 'string') {
		try {
			return JSON.parse(value['filter']);
		}
		catch (err) {
			throw new WarningException(err.message, getCurrentLine(), { value, ...options });
		}
	}
	else if (value
		&& typeof value === 'object') {
		return value;
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
