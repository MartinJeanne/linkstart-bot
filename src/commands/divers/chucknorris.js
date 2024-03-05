const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chucknorris')
		.setDescription('Envoie une des "Chuck Norris facts"'),

	async execute(interaction) {
		fetch('https://api.chucknorris.io/jokes/random')
			.then(response => response.json())
			.then(async data => await interaction.editReply(data.value))
			.catch(error => console.error(error));
	},
};
