import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const host = (propertyName, value, options = {}) => {
	if (typeof value !== 'undefined') {
		if (typeof value !== 'string') {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
		}
		const splitByPort = value.split(':');

		if (!(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(splitByPort[0]))
			&& !(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(splitByPort[0]))) {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
		}
		if (splitByPort[1]) {
			const port = Number(splitByPort[1]);

			if (typeof port !== 'number'
				|| !(port >= 1)) {
				throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
			}
		}
		return value;
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
