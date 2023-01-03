const { SlashCommandBuilder } = require('discord.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suivant')
		.setDescription('Passe à la musique suivante'),

	async execute(interaction, client) {
		const queue = await checkPlayerUsable(interaction, client);
		if (!queue) return;

		const nextSong = queue.tracks[0];
		queue.skip();
		return await interaction.editReply(`⏩ Suivant, musique actuelle : **${nextSong.title}**`);
	},
};
