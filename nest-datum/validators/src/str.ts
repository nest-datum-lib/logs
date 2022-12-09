import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const str = (propertyName: string, value, options = {}) => {
	if (value
		&& typeof value !== 'undefined') {
		if (typeof value === 'string') {
			const min = Number(options['min']);
			const max = Number(options['max']);

			if (!Number.isNaN(min)
				&& value.length < min) {
				throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}length is less than the minimum value.`, getCurrentLine(), { value, ...options });
			}
			if (!Number.isNaN(max)
				&& value.length > max) {
				throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}length exceeds the maximum value.`, getCurrentLine(), { value, ...options });
			}
			return value;
		}
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
