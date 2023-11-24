/** Wish happy birthday to users! */
const { checkForBirthday } = require('../endpoints/discordUser');

module.exports = async function (client) {

	const usersBirthday = await checkForBirthday();

	if (usersBirthday == null) return;

	const channelGeneralMAALSI = '1031873392254660651';

	for (let i = 0; i < usersBirthday.length; i++) {
		const channel = await client.channels.cache.get('790692532928905257');
		const age = usersBirthday[i].birthday;
		console.log(typeof age);

		channel.send(`Demain c'est ton anniversaire <@${usersBirthday[i].discordId}> ! Pour tes ${age}, n'oublie pas les croissants ;)`);
	}
};
