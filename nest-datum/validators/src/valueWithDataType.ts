import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const valueWithDataType = (propertyName: string, value, options = {}) => {
	if (typeof value !== 'undefined'
		&& value !== ''
		&& value !== null) {
		return value;
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
