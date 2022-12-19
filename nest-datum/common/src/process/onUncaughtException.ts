
const onUncaughtException = (err) => {
	console.error('CRITICAL ERROR', err);
};

export default onUncaughtException;
