import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

const transportVariants = [
	'TCP',
	'REDIS',
];

export const transport = (propertyName: string, value, options = {}) => {
	if (value
		&& typeof value !== 'undefined') {
		if (transportVariants.includes(value)) {
			return value;
		}
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
