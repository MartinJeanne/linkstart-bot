const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Respond with Pong!'),
	async execute(interaction) {
		await interaction.editReply({content: 'Pong !', ephemeral: true});
	},
};
