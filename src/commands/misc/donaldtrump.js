const { SlashCommandBuilder } = require('discord.js');
const { default: axios } = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('donaldtrump')
		.setDescription('Donad Trump said dump things. Discover one of it.'),

	async execute(interaction) {
		const response = await axios.get('https://www.tronalddump.io/random/quote')
			.catch(error => console.error(error));

		await interaction.editReply(`*${response.data.value}* ~ Donald Trump, ${response.data.appeared_at.slice(0, 10)}`);
	},
};
