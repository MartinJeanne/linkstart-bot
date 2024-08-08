const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('zen')
		.setDescription('Quelques mots inspirants'),

	async execute(interaction) {
		const quotes = await fetch('https://zenquotes.io/api/random')
			.then(response => response.json())
			.catch(error => console.error(error));

		if (quotes[0]) await interaction.editReply(`"${quotes[0].q}" - ${quotes[0].a}`);
		else await interaction.editReply('❌ Erreur lors de la récupération de la citation');
	},
};
