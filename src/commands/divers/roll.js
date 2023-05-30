const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription("Jette un dé !")
		.addStringOption(option => 
			option.setName('action')
			.setDescription('L\'action à réaliser')
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

		let result = Math.floor(Math.random() * maxValue) + 1;
		let response = `1d${maxValue} : ${result}`;

		if (action && action.trim()) response = `*${action}*\n ${response}`;
		
		if (modifier) {
			const modifierSigne = modifier > 0 ? '+' : '';
			result += modifier;
			response += ` (${modifierSigne}${modifier})`;
		}

		response += `\n🎲 **${result}**`;
		
		await interaction.editReply({ content: response });
	},
};
