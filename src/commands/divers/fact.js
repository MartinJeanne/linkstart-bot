const { SlashCommandBuilder } = require('discord.js');
const { default: axios } = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fact')
		.setDescription('Donne une "Chuck Norris fact"'),

	async execute(interaction) {
		let joke;
		await axios.get('https://api.chucknorris.io/jokes/random')
			.then(response => {
				joke = response.data.value;
			})
			.catch(error => console.log(error));
		await interaction.reply(joke);
	},
};