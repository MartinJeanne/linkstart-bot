/** Check if user can use Player commands */
module.exports = async function (interaction, client) {
	// if user is not in channel
	if (!interaction.member.voice.channel) {
		const error = ':interrobang: Tu dois être dans un salon vocal pour cela';
		if (!interaction.replied) await interaction.editReply(error);
		else await interaction.followUp(error);
		return null;
	}
	// if i'm in channel AND user is not in my channel
	else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
		const error = ':interrobang: Tu dois être dans le même salon vocal que moi pour cela';
		if (!interaction.replied) await interaction.editReply(error);
		else await interaction.followUp(error);
		return null;
	}

	const queue = client.player.getQueue(interaction.guildId);
	if (!queue || !queue.playing) {
		await interaction.editReply(':interrobang: Je ne joue pas de musique actuellement !');
		return null;
	} 
	else return queue;
};
