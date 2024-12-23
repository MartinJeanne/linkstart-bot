const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const { useMainPlayer } = require('discord-player');
const getQueue = require('../../functions/queue/getQueue.js');
const { addSongToQueue, addPlaylistToQueue } = require('../../functions/queue/addSongsToQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joue')
		.setDescription('Joue de la musique')
		.addStringOption(option => option.setName('musique')
			.setDescription('Nom ou lien de la musique')
			.setRequired(true)),

	async execute(interaction, client) {
		const toSearch = interaction.options.getString('musique');
		const player = useMainPlayer();

		const result = await player.search(toSearch, {
			requestedBy: interaction.user,
			//searchEngine: QueryType.SPOTIFY_SEARCH,
		});

		const queue = await getQueue({ interaction: interaction, canCreate: true });
		if (!queue) return;

		try {
			const tracks = result.tracks;
			if (tracks.length === 0) {
				return await interaction.editReply(':interrobang: Pas de résultat pour cette recherche');
			}
			else if (result.playlist) {
				const reply = addPlaylistToQueue(tracks, result.playlist, queue);
				return await interaction.editReply(reply);
			}
			else {
				const reply = addSongToQueue(tracks[0], queue);
				return await interaction.editReply(reply);
			}
		} catch (error) {
			console.error(error);
			await interaction.editReply('❌ Erreur lors de la lecture de la musique');
		}
	}
}
