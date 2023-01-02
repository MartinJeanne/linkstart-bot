const { SlashCommandBuilder } = require('discord.js');
const { default: axios } = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chucknorris')
		.setDescription('Envoie une des "Chuck Norris facts"'),

	async execute(interaction) {
		let joke;
		await axios.get('https://api.chucknorris.io/jokes/random')
			.then(response => joke = response.data.value)
			.catch(error => console.log(error));

		await interaction.editReply(joke);
	},
};