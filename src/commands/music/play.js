const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play music')
		.addStringOption(option => option.setName('music')
			.setDescription('Name or link of the music')
			.setRequired(true)),

	async execute(interaction, client) {
		const queue = await getQueue({ interaction: interaction, client: client, canCreate: true });
		if (!queue) return;

		const toSearch = interaction.options.getString('music');
		const result = await client.player.search(toSearch, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO
		});
		if (result.tracks.length === 0) {
			await queue.destroy();
			return await interaction.editReply(':interrobang: No result found for this search');
		}

		if (result.playlist) {
			queue.addTrack(result.tracks);
			await interaction.editReply(`▶️ **${result.tracks.length}** music added from ${result.playlist.type}: **${result.playlist.title}** `);
		}
		else {
			try {
				queue.addTrack(result.tracks[0]);
				await interaction.editReply(`▶️ **${result.tracks[0].title}**`);
			} catch (error) {
				console.error(error);
				await interaction.editReply('❌ Oops, something went wrong when playing the music');
			}
		}

		if (!queue.isPlaying()) await queue.node.play();
	}
};
