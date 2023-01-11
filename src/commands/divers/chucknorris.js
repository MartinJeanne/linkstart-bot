const { SlashCommandBuilder } = require('discord.js');
const { default: axios } = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chucknorris')
		.setDescription('Envoie une des "Chuck Norris facts"'),

	async execute(interaction) {
		await axios.get('https://api.chucknorris.io/jokes/random')
			.then(async response => await interaction.editReply(response.data.value))
			.catch(error => console.error(error));
	},
};