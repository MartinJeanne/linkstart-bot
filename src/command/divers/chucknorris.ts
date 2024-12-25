import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";


export default {
	data: new SlashCommandBuilder()
		.setName('chucknorris')
		.setDescription('Envoie une des "Chuck Norris facts"'),

	async execute(interaction: ChatInputCommandInteraction) {
		const joke = await fetch('https://api.chucknorris.io/jokes/random')
			.then(response => response.json())
			.catch(error => console.error(error));

		if (joke) await interaction.editReply(joke.value);
		else await interaction.editReply('❌ Erreur lors de la récupération de la blague');
	},
};
