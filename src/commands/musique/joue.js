const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const { useMainPlayer } = require('discord-player');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joue')
		.setDescription('Joue de la musique')
		.addStringOption(option => option.setName('musique')
			.setDescription('Nom ou lien de la musique')
			.setRequired(true)),

	async execute(interaction, client) {
		const queue = await getQueue({ interaction: interaction, client: client, canCreate: true });
		if (!queue) return;

		const toSearch = interaction.options.getString('musique');
		const player = useMainPlayer();

		const result = await player.search(toSearch, {
			requestedBy: interaction.user,
			searchEngine: QueryType.SPOTIFY_SEARCH,
		});		

		if (result.tracks.length === 0) {
			await queue.clear();
			return await interaction.editReply(':interrobang: Pas de résultat pour cette recherche');
		}

		try {
			if (result.playlist) {
				queue.addTrack(result.tracks);
				return await interaction.editReply(`▶️ **${result.tracks.length}** musiques ajoutées depuis la ${result.playlist.type} : **${result.playlist.title}** `);
			}
			
			const track = result.tracks[0];
			queue.addTrack(track);
			await interaction.editReply(`▶️ **Titre :** ${track.title}\n **Auteur :** ${track.author}`);
		} catch (error) {
			console.error(error);
			await interaction.editReply('❌ Oups, erreur lors de la lecture de la musique');
		}

		if (!queue.isPlaying()) await queue.node.play();
	}
}
