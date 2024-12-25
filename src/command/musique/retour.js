const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../service/queue/getQueue');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('retour')
		.setDescription('Rejoue la dernière musique'),

	async execute(interaction, client) {
		const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
		if (!queue) return;

		if (!queue.history.previousTrack) return await interaction.editReply('❌ Pas de musique précédente');
		queue.history.back();
		return await interaction.editReply('⏪ Retour à la musique précédente');
	},
};
