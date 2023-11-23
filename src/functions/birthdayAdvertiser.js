/** Wish happy birthday to users! */
const { checkForBirthday } = require('../endpoints/discordUser');

module.exports = async function (client) {

	const usersBirthday = await checkForBirthday();

	if (usersBirthday == null) return;

	for (let i = 0; i < usersBirthday.length; i++) {
		const channel = await client.channels.cache.get('790692532928905257');

		channel.send(`Bon anniversaire <@${usersBirthday[i].discordId}> !`);
	}
};
