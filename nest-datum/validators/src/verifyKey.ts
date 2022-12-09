import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const verifyKey = (propertyName, value, options = {}) => {
	if (typeof value !== 'undefined') {
		try {
			const valueParsed = JSON.parse(Buffer.from(value, 'base64').toString());

			if (options['includeValue']) {
				valueParsed[propertyName] = value;
			}
			return valueParsed;
		}
		catch (err) {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
		}
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
