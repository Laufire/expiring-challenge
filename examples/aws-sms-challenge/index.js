const SMSHelper = require('aws-sms-helper');
const ExpiringChallenge = require('../../src');

/* Data */
const ENV = Object.assign({}, process.env);
const { accessKeyId, secretAccessKey, region, phone } = ENV;

/* Delegates */
const smsHelper = new SMSHelper({
	AWSConfig: {
		accessKeyId, secretAccessKey, region,
	},
});

const action = ({ id, secret }) =>
	smsHelper.send({
		message: `Your OTP for <Some Company> is ${secret}`,
		phoneNumber: id,
		senderID: 'AlphaNum11' // #Note: In some AWS Regions, this has to be registered with AWS.
	});

(async () => {

	const ec = new ExpiringChallenge({
		action,
		secretLength: 8,
		expiry: 60000,
		challengeLimit: 1000,
	});

	const challenge = await ec.create({ id: phone });
	console.log(`Challenge sent to: ${phone}`);
	console.log(await ec.patch({ id: challenge.id, secret: challenge.secret }));

})();
