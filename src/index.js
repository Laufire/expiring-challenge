/* The entry point. */

/* Delegates */
const { floor, random } = Math;
const { entries } = Object;

/* Helpers */
const generateSecret = (secretLength) => {
	let ret = '';

	while(secretLength--)
		ret += floor(random() * 10);

	return ret;
};

const cleanUpStore = async (Store) => {
	const now = new Date();

	entries(Store).forEach(([key, value]) => {

		if(now > value.expiry)
			delete Store[key];
	});
};

/* Exports */
module.exports = function({
	action,
	secretLength = 8,
	expiry = 30000,
	challengeLimit = 10000,
}) {

	/* State */
	const Store = {};
	let challengeCount = 0;

	/* Exports */
	this.create = async ({ id, secret }) => {
		secret = secret || generateSecret(secretLength);
		const challenge = {
			id, secret,
			expiry: expiry ? new Date(new Date().valueOf() + expiry) : undefined,
		};

		if(challengeCount++ > challengeLimit) {
			challengeCount == 0;
			cleanUpStore(Store); //Note: This is an async call.
		}

		Store[id] = challenge;
		action({ id, secret });

		return challenge;
	};

	this.patch = async ({ id, secret }) => { //#Note: This method is used to verify the challenge.
		const stored = Store[id];

		if(stored && secret === stored.secret && ! (new Date() > stored.expiry))
			return stored;
	};

	/* Conventional Methods */
	this.get = async ({ id }) => Store[id];

	this.delete = async ({ id }) => delete Store[id];
};
