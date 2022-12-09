import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const int = (propertyName: string, value, options = {}) => {
	if (typeof value !== 'undefined') {
		const valueInt = parseInt(value, 10);
		const min = Number(options['min']);
		const max = Number(options['max']);

		if (!Number.isNaN(min)
			&& valueInt < min) {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is less than the minimum value.`, getCurrentLine(), { value, ...options });
		}
		if (!Number.isNaN(max)
			&& valueInt > max) {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}exceeds the maximum value.`, getCurrentLine(), { value, ...options });
		}
		return valueInt;
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
