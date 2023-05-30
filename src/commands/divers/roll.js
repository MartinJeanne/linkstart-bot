const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription("Jette un dé !")
		.addStringOption(option => 
			option.setName('action')
			.setDescription('Laction à réaliser')
			.setRequired(false))
		.addIntegerOption(option => 
			option.setName('nombre-face')
			.setDescription('La valeur max du dé')
			.setRequired(false))
		.addIntegerOption(option => 
			option.setName('modificateur')
			.setDescription('Bonus ou malus')
			.setRequired(false)),

	async execute(interaction, client) {
		const action = interaction.options.getString('action');
		const parameter = interaction.options.getInteger('nb face');
		const modifier = interaction.options.getInteger('modificateur');
		const maxValue = parameter != null ? parameter : 20;

		const result = Math.floor(Math.random() * maxValue) + 1;
		let response = `🎲 **${result}**/${maxValue}`;
		if (modifier) {
			const modifierSigne = modifier > 0 ? '+' : '';
			response += ` (${modifierSigne}${modifier}) = **${result + modifier}**`;
		}
		if (action && action.trim()) response = `*${action}*\n ${response}`;		

		await interaction.editReply({ content: response });
	},
};
