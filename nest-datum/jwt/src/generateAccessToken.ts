import utilsJWTCreateHeader from './createHeader';
import utilsJWTCreatePayload from './createPayload';
import utilsJWTCreateSignature from './createSignature';

const generateAccessToken = (userData, iat, exp = process.env.JWT_ACCESS_TIMEOUT) => {
	const publicString = `${utilsJWTCreateHeader()}.${utilsJWTCreatePayload({
		exp,
		id: userData.id,
		email: userData.email,
		roleId: userData.roleId,
		iat,
	})}`;

	return `${publicString}.${utilsJWTCreateSignature(publicString.trim(), process.env.JWT_SECRET_ACCESS_KEY || process['JWT_SECRET_ACCESS_KEY'])}`;
};

export default generateAccessToken;
