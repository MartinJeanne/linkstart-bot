/** Wish happy birthday to users! */
const { checkForBirthday } = require('../endpoints/discordUser');

module.exports = async function (client) {

	const usersBirthday = await checkForBirthday();

	if (usersBirthday == null) return;

	const channelGeneralMAALSI = '1031873392254660651';

	for (let i = 0; i < usersBirthday.length; i++) {
		const channel = await client.channels.cache.get('790692532928905257');
		const birthday = usersBirthday[i].birthday;
		const birthdayYear = parseInt(birthday.slice(0, 4));
		const currentYear = new Date().getFullYear();
		const age = currentYear - birthdayYear;

		//channel.send(`Demain c'est ton anniversaire <@${usersBirthday[i].discordId}> ! Pour tes ${age} ans, amène des croissants 😉`);
		channel.send(`Bon anniversaire <@${usersBirthday[i].discordId}> ! 😎`);
	}
};
