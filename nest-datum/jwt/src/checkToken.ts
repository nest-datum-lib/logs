import utilsJWTCreateHeader from './createHeader';
import utilsJWTCreatePayload from './createPayload';
import utilsJWTCreateSignature from './createSignature';

const checkToken = (token = '', key = '', payload = {}) => {
	const publicString = `${utilsJWTCreateHeader()}.${utilsJWTCreatePayload(payload)}`;
	const recoveredToken = `${publicString}.${utilsJWTCreateSignature(publicString.trim(), key)}`;

	return token === recoveredToken;
};

export default checkToken;
