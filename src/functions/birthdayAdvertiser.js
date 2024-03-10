/** Wish happy birthday to users! */
const { checkForBirthday } = require('../endpoints/members');
const { getGuild } = require('../endpoints/guilds');


module.exports = async function (client) {
	const members = await checkForBirthday();
	if (members == null) return;

	for (let i = 0; i < members.length; i++) {
		for (let y = 0; y < members[i].guildIds.length; y++) {
			const guild = await getGuild(members[i].guildIds[y]);
			if (!guild.botChannelId) return;
			const channel = await client.channels.cache.get(guild.botChannelId);
			if (!channel) return;
			channel.send(`Bon anniversaire <@${members[i].id}> ! 😎`);
		}
	}
}
