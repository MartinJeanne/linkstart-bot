const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('back')
		.setDescription('Return to the last music'),

	async execute(interaction, client) {
		const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
		if (!queue) return;

		if (!queue.history.previousTrack) return await interaction.editReply('❌ No previous music');
		queue.history.back();
		return await interaction.editReply('⏪ Back to previous music');
	},
};
