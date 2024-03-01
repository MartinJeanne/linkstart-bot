/** Wish happy birthday to users! */
const { checkForBirthday } = require('../endpoints/members');
const { getGuild } = require('../endpoints/guilds');


module.exports = async function (client) {
	const members = await checkForBirthday();
	if (members == null) return;

	for (let i = 0; i < members.length; i++) {
		const guild = await getGuild(members[i].guildId)
		const channel = await client.channels.cache.get(guild.botChannelId);

		channel.send(`Bon anniversaire <@${members[i].id}> ! 😎`);
	}
};
