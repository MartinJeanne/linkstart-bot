const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joue')
		.setDescription('Joue de la musique')
		.addStringOption(option => option.setName('musique')
			.setDescription('Nom ou lien de la musique')
			.setRequired(true)),

	async execute(interaction, client) {		
		const queue = await checkPlayerUsable(interaction, client);

		const toSearch = interaction.options.getString('musique');
		const result = await client.player.search(toSearch, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO
		});
		if (result.tracks.length === 0) {
			await queue.destroy();
			return await interaction.editReply(':interrobang: Pas de résultat pour cette recherche');
		}

		result.playlist ? queue.addTracks(result.tracks) : queue.addTrack(result.tracks[0]);

		if (!queue.playing) {
			await queue.play();
			if (!result.playlist)
				await interaction.editReply(`▶️ **${result.tracks[0].title}**`);
		}
		else if (!result.playlist)
			await interaction.editReply(`▶️ **${queue.tracks.length}.** position : **${result.tracks[0].title}**`);

		if (result.playlist)
			await interaction.editReply(`▶️ **${result.tracks.length}** musiques ajoutées depuis la ${result.playlist.type} : **${result.playlist.title}** `);
	},
};
