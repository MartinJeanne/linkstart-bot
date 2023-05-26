const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription("Jette un dé !")
		.addIntegerOption(option => option.setName('valeur')
			.setDescription('La valeur max du dé')
			.setRequired(false)),

	async execute(interaction, client) {
		const parameter = interaction.options.getInteger('valeur');
		const maxValue = parameter != null ? parameter : 20;

		const result = Math.floor(Math.random() * maxValue);
		await interaction.editReply({ content: `Dé à **${maxValue}** face\nRésultat : **${result}**🎲`});
	},
};
