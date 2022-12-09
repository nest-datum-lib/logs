import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';

export const path = (propertyName, value, options = {}) => {
	if (typeof value !== 'undefined') {
		if (typeof value !== 'string') {
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
		}
		const valueStr = value[0] === '/'
			? value.substr(1)
			: value;

		const valueSplit = valueStr.split('/');
		let i = 0;

		if (valueSplit.length === 1
			&& valueSplit[0] === '') {
			return '/'+ valueStr;
		}

		while (i < valueSplit.length) {
			if (!valueSplit[i]
				|| !(/[^/.]/ig.test(valueSplit[i]))) {
				throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
			}
			i++;
		}
		return '/'+ valueStr;
	}
	else if (options['isRequired']) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
