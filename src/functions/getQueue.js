/** Check if user can use Player commands */
module.exports = async function (args) {
	const interaction = args.interaction;
	const client = args.client;
	const canCreate = args.canCreate;

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


	const queue = client.player.nodes.get(interaction.guildId);
	if (queue) return queue;
	
	else if (!canCreate) {
		await interaction.editReply(':interrobang: Je ne joue pas de musique actuellement !');
		return null;
	}

	// Create the server queue with options
	const newQueue = await client.player.nodes.create(interaction.guild, {
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
	if (!newQueue.connection) await newQueue.connect(interaction.member.voice.channel);
	return newQueue;
};
