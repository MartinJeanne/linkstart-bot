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
			.setDescription('La valeur max du dé (défaut 20)')
			.setRequired(false)
			.setMaxValue(10000))
			.addIntegerOption(option => 
				option.setName('nombre-dé')
				.setDescription('La nb de dé(s) à lancer (défaut 1)')
				.setRequired(false)
				.setMaxValue(30))
		.addIntegerOption(option => 
			option.setName('modificateur')
			.setDescription('Bonus ou malus')
			.setRequired(false)),

	async execute(interaction, client) {
		const action = interaction.options.getString('action');
		const parameter = interaction.options.getInteger('nombre-face');
		let nbDice = interaction.options.getInteger('nombre-dé');
		const modifier = interaction.options.getInteger('modificateur');
		const maxValue = parameter != null ? parameter : 20;
		if (!nbDice) nbDice = 1;

		let response = `${nbDice}d${maxValue} : `;
		let result = 0;
		for (let i = 0; i < nbDice; i++) {
			const diceValue = Math.floor(Math.random() * maxValue) + 1;
			response += `${diceValue}, `;
			result += diceValue;
			
		}
		response = response.slice(0, -2); 

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
