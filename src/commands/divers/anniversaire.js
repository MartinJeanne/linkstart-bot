const { SlashCommandBuilder } = require('discord.js');
const { getOrCreateMember, putMember } = require('../../endpoints/members.js');

module.exports = {
	isEphemeral: true,
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
		let day = interaction.options.getInteger('jour');
		let month = interaction.options.getInteger('mois');

		if (day < 10) day = `0${day}`;
		if (month < 10) month = `0${month}`;

		const apiMember = await getOrCreateMember(interaction.member);
		apiMember.birthday = `1900-${month}-${day}`;
		await putMember(apiMember);

		await interaction.editReply(`Ta date de naissance a été enregistrée : ${day}/${month}/----`);
	},
};
