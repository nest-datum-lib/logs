import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const arr = (propertyName: string, value, options = {}) => {
	if (value
		&& typeof value === 'string') {
		try {
			const valueTemp =  JSON.parse(value['filter']);

			if (Array.isArray(valueTemp)) {
				return valueTemp;
			}
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is not array.`, getCurrentLine(), { value, ...options });
		}
		catch (err) {
			throw new WarningException(err.message, getCurrentLine(), { value, ...options });
		}
	}
	else if (value
		&& Array.isArray(value)) {
		return value;
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
