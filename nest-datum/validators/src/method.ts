import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const method = (propertyName: string, value, options = {}) => {
	if (typeof value !== 'undefined') {
		const valueProcessed = value.toString().toLowerCase();

		if (valueProcessed === 'get'
			|| valueProcessed === 'post'
			|| valueProcessed === 'patch'
			|| valueProcessed === 'put'
			|| valueProcessed === 'delete') {
			return value;
		}
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is not valid HTTP method.`, getCurrentLine(), { value, ...options });
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
