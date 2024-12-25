import { TextChannel } from "discord.js";
import { ClientEx } from "../model/Client";

const { checkForBirthday } = require('./endpoints/members');
const { getGuild } = require('./endpoints/guilds');

/** Wish happy birthday to users! */
export default async function (client: ClientEx) {
	const members = await checkForBirthday();
	if (members == null) return;

	for (let i = 0; i < members.length; i++) {
		for (let y = 0; y < members[i].guildsId.length; y++) {	
			const guild = await getGuild(members[i].guildsId[y]);
			if (!guild.botChannelId) return;
			const channel = await client.channels.cache.get(guild.botChannelId) as TextChannel | undefined;
			if (!channel) return;
			channel.send(`Bon anniversaire <@${members[i].id}> ! 😎`);
		}
	}
}
