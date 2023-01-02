import { AccessToken } from './decorators/access-token.decorator';
import envPropsBySubstr from './utils/envPropsBySubstr';
import getEnvValue from './utils/getEnvValue';
import setEnvValue from './utils/setEnvValue';
import readEnvVars from './utils/readEnvVars';
import isObject from './utils/isObject';
import getFile from './utils/getFile';
import onExit from './process/onExit';
import onWarning from './process/onWarning';
import onUncaughtException from './process/onUncaughtException';
import { CustomServerTCP } from './strategy/custom-server-tcp.strategy';

const TransportStrategies = {
	TCP: CustomServerTCP,
};

export {
	AccessToken,
	envPropsBySubstr,
	isObject,
	getFile,
	TransportStrategies,
	getEnvValue,
	setEnvValue,
	readEnvVars,
	onExit,
	onWarning,
	onUncaughtException,
};
