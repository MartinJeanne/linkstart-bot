const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription("Roll a dice !")
		.addStringOption(option => 
			option.setName('action')
			.setDescription('Action that your character wants to perform')
			.setRequired(false))
		.addIntegerOption(option => 
			option.setName('dice-value')
			.setDescription('Max dice value (default 20)')
			.setRequired(false)
			.setMaxValue(10000))
			.addIntegerOption(option => 
				option.setName('dice-to-roll')
				.setDescription('Number of dice to roll (default 1)')
				.setRequired(false)
				.setMaxValue(30))
		.addIntegerOption(option => 
			option.setName('modifier')
			.setDescription('Bonus or malus')
			.setRequired(false)),

	async execute(interaction, client) {
		const action = interaction.options.getString('action');
		const parameter = interaction.options.getInteger('dice-value');
		let nbDice = interaction.options.getInteger('dice-to-roll');
		const modifier = interaction.options.getInteger('modifier');
		const maxValue = parameter != null ? parameter : 20;
		if (!nbDice) nbDice = 1;

		let response;
		if (action && action.trim()) response = `*${action}*\n${nbDice}d${maxValue} : `;
		else  response = `${nbDice}d${maxValue} : `;

		let result = 0;
		for (let i = 0; i < nbDice; i++) {
			const diceValue = Math.floor(Math.random() * maxValue) + 1;
			response += `${diceValue}, `;
			result += diceValue;
		}
		response = response.slice(0, -2);
		
		if (modifier) {
			const modifierSigne = modifier > 0 ? '+' : '';
			result += modifier;
			response += ` (${modifierSigne}${modifier})`;
		}

		response += `\n🎲 **${result}**`;
		
		await interaction.editReply({ content: response });
	},
};
