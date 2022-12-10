const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joue une musique')
		.addStringOption(option => option.setName('musique')
			.setDescription('Nom ou url de la musique')
			.setRequired(true)),

	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true }); // make Discord wait for reply

		const channel = interaction.member.voice.channel;
		if (!channel)
			return interaction.editReply('Tu dois être dans un salon vocal pour exécuter cette commande !');
		else if (interaction.guild.members.me.voice.channelId && interaction.guild.me.voice.channelId !== interaction.member.voice.channelId)
			return interaction.editReply('Tu dois être dans le même salon vocal que moi pour exécuter cette commande !');

		const queue = await client.player.createQueue(interaction.guild);
		if (!queue.connection) await queue.connect(channel);

		const toSearch = interaction.options.getString('musique');
		const result = await client.player.search(toSearch, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO
		});
		if (result.tracks.length === 0) return interaction.editReply('Pas de résultat');

		const song = result.tracks[0];
		await queue.addTrack(song);

		if (!queue.playing) await queue.play();

		interaction.editReply('Ajouté à la file : **' + song.title + '**');
	},
};