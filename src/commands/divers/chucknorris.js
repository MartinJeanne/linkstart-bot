const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chucknorris')
		.setDescription('Envoie une des "Chuck Norris facts"'),

	async execute(interaction) {
		const joke = await fetch('https://api.chucknorris.io/jokes/random')
			.then(response => response.json())
			.then(data => data.value)
			.catch(console.error);

		await interaction.editReply(joke);
	},
};
