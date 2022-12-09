import { AccessToken } from './decorators/access-token.decorator';
import envPropsBySubstr from './utils/envPropsBySubstr';
import getEnvValue from './utils/getEnvValue';
import setEnvValue from './utils/setEnvValue';
import readEnvVars from './utils/readEnvVars';
import isObject from './utils/isObject';
import { CustomServerTCP } from './strategy/custom-server-tcp.strategy';

const TransportStrategies = {
	TCP: CustomServerTCP,
};

export {
	AccessToken,
	envPropsBySubstr,
	isObject,
	TransportStrategies,
	getEnvValue,
	setEnvValue,
	readEnvVars,
};
