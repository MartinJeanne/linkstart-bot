const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('donaldtrump')
		.setDescription('Découvre une chose débile que Donald Trump a dit'),

	async execute(interaction) {
		const joke = await fetch('https://www.tronalddump.io/random/quote')
			.then(response => response.json())
			.catch(error => console.error(error));

		if (joke) await interaction.editReply(`"*${joke.value}*" - Donald Trump, ${joke.appeared_at.slice(0, 10)}`);
		else await interaction.editReply('❌ Erreur lors de la récupération de la blague');
	}
};
