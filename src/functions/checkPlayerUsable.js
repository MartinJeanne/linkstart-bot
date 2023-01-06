/** Check if user can use Player commands */
module.exports = async function (interaction, client) {
	// if user is not in channel
	if (!interaction.member.voice.channel)
		return await interaction.editReply(':interrobang: Tu dois être dans un salon vocal pour exécuter cette commande !');
	// if i'm in channel AND user is not in my channel
	else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
		return await interaction.editReply(':interrobang: Tu dois être dans le même salon vocal que moi pour exécuter cette commande !');

	const queue = client.player.getQueue(interaction.guildId);
	if (!queue) {
		// Create the server queue with options
		const queue = await client.player.createQueue(interaction.guild, {
			leaveOnEnd: false,
			leaveOnStop: true,
			leaveOnEmpty: true,
			autoSelfDeaf: false,
			spotifyBridge: true,
			ytdlOptions: {
				filter: 'audioonly',
				opusEncoded: true,
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			}
		});
		if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		return queue;
	}
	return queue;
};