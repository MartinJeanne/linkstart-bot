const { SlashCommandBuilder } = require('discord.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop la musique'),

	async execute(interaction, client) {
		await interaction.deferReply(); // make Discord API wait for reply

		const queue = await checkPlayerUsable(interaction, client);
		if (!queue) return;
		
		queue.destroy();
		return await interaction.editReply('🛑 Tchao !');
	},
};