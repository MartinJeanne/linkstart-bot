const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('donaldtrump')
		.setDescription('Découvre une chose débile que Donald Trump a dit'),

	async execute(interaction) {
		const data = await fetch('https://www.tronalddump.io/random/quote')
			.then(response => response.json())
			.catch(error => console.error(error));

		await interaction.editReply(`"*${data.value}*" - Donald Trump, ${data.appeared_at.slice(0, 10)}`);
	}
};
