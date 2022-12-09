import getCurrentLine from 'get-current-line';
import { WarningException } from 'nest-datum/exceptions/src';
import { checkToken } from 'nest-datum/jwt/src';

export const token = (propertyName: string, value, options = {}) => {
	let timeoutApp = options['timeout'] || process.env.JWT_ACCESS_TIMEOUT,
		secretApp = options['secret'] || process['JWT_SECRET_ACCESS_KEY'];

	if (!secretApp
		|| typeof secretApp !== 'string') {
		throw new WarningException(`"secret" property is incorrect in token${propertyName ? ` "${propertyName}" `: ''}validation.`, getCurrentLine(), { value, ...options });
	}
	if (!timeoutApp
		&& typeof timeoutApp !== 'number'
		&& typeof timeoutApp !== 'string') {
		throw new WarningException(`"timeout" property is incorrect in token${propertyName ? ` "${propertyName}" `: ''}validation.`, getCurrentLine(), { value, ...options });
	}
	timeoutApp = Number(timeoutApp);

	if (value !== 'null') {
		if (!(timeoutApp > 0)) {
			throw new WarningException(`"timeout" property with bad value in token${propertyName ? ` "${propertyName}" `: ''}validation.`, getCurrentLine(), { value, ...options });
		}
	}

	if (typeof value !== 'undefined') {
		if (typeof value === 'string') {
			if (value === 'null') {
				return {
					[propertyName]: value,
					authFlag: false,
				};
			}
			try {
				const userData = JSON.parse(Buffer.from((value.split('.'))[1], 'base64').toString());

				if (!checkToken(value, secretApp, {
					...userData,
					exp: (timeoutApp || '').toString(),
				})) {
					throw new Error(`Token${propertyName ? ` "${propertyName}" `: ''}is not valid.`);
				}
				return {
					[propertyName]: value,
					...userData,
				};
			}
			catch (err) {
				throw new WarningException(err.message, getCurrentLine(), { value, ...options });
			}
		}
		throw new WarningException(`Token${propertyName ? ` "${propertyName}" `: ''}is incorrect.`, getCurrentLine(), { value, ...options });
	}
	else if (options['isRequired']) {
		throw new WarningException(`Token${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
	return {
		[propertyName]: value,
		authFlag: false,
	};
};
