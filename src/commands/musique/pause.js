const { SlashCommandBuilder } = require('discord.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause ou relance la musique'),

	async execute(interaction, client) {
		const queue = await checkPlayerUsable(interaction, client);
		if (!queue) return;

		await queue.setPaused(!queue.connection.paused);

		if (queue.connection.paused) await interaction.editReply('⏸️ Musique mise en pause');
		else await interaction.editReply('▶️ Reprise de la musique');
	},
};