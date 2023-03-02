const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop la musique'),

	async execute(interaction, client) {
		const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
		if (!queue) return;
		
		queue.delete();
		return await interaction.editReply('⏹️ Tchao !');
	},
};
