const { SlashCommandBuilder } = require('discord.js');
const { getMember } = require('../../endpoints/members.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anniversaire')
		.setDescription('Enregistre ton anniversaire, je le souhaiterai le moment venu !')
		.addIntegerOption(option => option.setName('jour')
			.setDescription('Jour de naissance')
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(31))
		.addIntegerOption(option => option.setName('mois')
			.setDescription('Mois de naissance')
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(12)),

	async execute(interaction) {
		const day = interaction.options.getInteger('jour');
		const month = interaction.options.getInteger('mois');

		interaction.editReply(day + " " + month);
	},
};
