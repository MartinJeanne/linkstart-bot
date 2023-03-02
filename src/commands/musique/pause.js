const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause ou relance la musique'),

	async execute(interaction, client) {
		const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
		if (!queue) return;

		if(await queue.node.isPaused()) {
			await queue.node.resume();
			await interaction.editReply('▶️ Reprise de la musique');
		}
		else {
			await queue.node.pause();
			await interaction.editReply('⏸️ Musique mise en pause');
		}
	},
};
