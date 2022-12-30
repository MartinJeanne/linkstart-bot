const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joue')
		.setDescription('Joue de la musique')
		.addStringOption(option => option.setName('musique')
			.setDescription('Nom ou lien de la musique')
			.setRequired(true)),

	async execute(interaction, client) {
		await interaction.deferReply(); // make Discord API wait for reply

		const channel = interaction.member.voice.channel;
		// if user is not in channel
		if (!channel)
			return await interaction.editReply(':interrobang: Tu dois être dans un salon vocal pour exécuter cette commande !');
		// if i'm in channel AND user is not in my channel
		else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
			return await interaction.editReply(':interrobang: Tu dois être dans le même salon vocal que moi pour exécuter cette commande !');

		// Create the server queue with options
		const queue = client.player.createQueue(interaction.guild, {
			leaveOnEnd: false,
			leaveOnStop: true,
			leaveOnEmpty: true,
			autoSelfDeaf: false,
			spotifyBridge: true,
			ytdlOptions: {
				quality: "highestaudio",
				highWaterMark: 1 << 25,
			}
		});
		if (!queue.connection) await queue.connect(channel);

		const toSearch = interaction.options.getString('musique');
		const result = await client.player.search(toSearch, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO
		});
		if (result.tracks.length === 0) return await interaction.editReply(':interrobang: Pas de résultat pour cette recherche');
		const song = result.tracks[0];

		await queue.addTrack(song);
		if (!queue.playing) {
			await queue.play();
			await interaction.editReply(`▶️ Je joue : **${song.title}**`);
		}
		else await interaction.editReply(`▶️ Ajouté à la file : **${song.title}**`);
	},
};
