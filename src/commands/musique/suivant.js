const { SlashCommandBuilder } = require('discord.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suivant')
		.setDescription('Passe à la musique suivante'),

	async execute(interaction, client) {
		const queue = await checkPlayerUsable(interaction, client);
		if (!queue) return;

		queue.skip();
		return await interaction.editReply('⏩ Musique passé');
	},
};