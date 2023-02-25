const { SlashCommandBuilder } = require('discord.js');
const checkPlayerPlaying = require('../../functions/checkPlayerPlaying.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suivant')
		.setDescription('Passe à la musique suivante'),

	async execute(interaction, client) {
		const queue = await checkPlayerPlaying(interaction, client);
		if (!queue) return;

		if (queue.tracks.length > 0) await queue.play(); // Skip don't work so well, queue.play() do the same thing
		else await queue.skip(); // We use skip in the case no songs in queue, to terminate the current song
		return await interaction.editReply(`⏩ Suivant, musique actuelle : **${queue.nowPlaying().title}**`);
	},
};
