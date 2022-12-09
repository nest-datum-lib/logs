import getCurrentLine from 'get-current-line';
import { 
	WarningException,
	ErrorException, 
} from 'nest-datum/exceptions/src';

const requestToDataType = async (registryService) => {

};

export const enumService = async (propertyName: string, value, options = {}) => {
	const registryService = options['registryService'];
	const serviceName = options['serviceName'];
	const cmd = options['cmd'];
	const isRequired = options['isRequired'];
	const callback = typeof options['callback'] === 'function'
		? options['callback']
		: (() => ({}));

	delete options['registryService'];
	delete options['serviceName'];
	delete options['cmd'];
	delete options['isRequired'];

	if (!registryService) {
		throw new WarningException(`Redis provider is undefined in "${propertyName}" property validation.`, getCurrentLine(), { value, ...options });
	}
	if (!serviceName
		|| cmd
		|| typeof serviceName !== 'string'
		|| typeof cmd !== 'string') {
		throw new WarningException(`Incorrect parameters for targeting to another service in "${propertyName}" property validation.`, getCurrentLine(), { value, ...options });
	}

	if (typeof value !== 'undefined') {
		try {
			const response = await registryService.send(serviceName, cmd, { ...options });
		
			if (callback(response).includes(value)) {
				return value;
			}
			throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}invalid format.`, getCurrentLine(), { value, ...options });
		}
		catch (err) {
			throw new WarningException(err.message, getCurrentLine(), { value, ...options });
		}
		return value;
	}
	else if (isRequired) {
		throw new WarningException(`property${propertyName ? ` "${propertyName}" `: ''}is empty.`, getCurrentLine(), { value, ...options });
	}
};
