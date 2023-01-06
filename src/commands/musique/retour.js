const { SlashCommandBuilder } = require('discord.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('retour')
		.setDescription('Rejoue la dernière musique'),

	async execute(interaction, client) {
		const queue = await checkPlayerUsable(interaction, client);
		if (!queue) return;

		if (!queue.previousTracks[1]) return await interaction.editReply('❌ Pas de musique précédente');
		queue.back();
		return await interaction.editReply('⏪ Retour à la musique précédente');
	},
};