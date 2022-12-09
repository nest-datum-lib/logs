import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const bool = (propertyName: string, value, options = {}) => {
	if (typeof value !== 'undefined') {
		if (typeof value === 'boolean') {
			return value;
		}
		const valueStr = String(value).toLowerCase();

		if (valueStr === 'true'
			|| valueStr === '1') {
			return true;
		}
		else if (valueStr === 'false'
			|| valueStr === '0') {
			return false;
		}
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is not boolean type.`, getCurrentLine(), { value, ...options });
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
