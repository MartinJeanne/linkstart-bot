const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause or resume music'),

	async execute(interaction, client) {
		const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
		if (!queue) return;

		if(await queue.node.isPaused()) {
			await queue.node.resume();
			await interaction.editReply('▶️ Music resumed');
		}
		else {
			await queue.node.pause();
			await interaction.editReply('⏸️ Music paused');
		}
	},
};
