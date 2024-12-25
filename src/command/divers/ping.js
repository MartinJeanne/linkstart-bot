const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Répond avec Pong !'),
	async execute(interaction) {
		await interaction.editReply({content: 'Pong !', ephemeral: true});
	},
};
