import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { patchMember } from '../../service/endpoints/members';


export default {
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

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.user.id) throw new Error('');
		const dayRaw = interaction.options.getInteger('jour') as number;
		const monthRaw = interaction.options.getInteger('mois') as number;

		let day: string;
		if (dayRaw < 10) day = `0${dayRaw}`;
		else day = dayRaw.toString();

		let month: string;
		if (monthRaw < 10) month = `0${monthRaw}`;
		else month = monthRaw.toString();

		await patchMember(interaction.user.id, { birthday: `1900-${month}-${day}` });

		await interaction.editReply(`Ta date de naissance a été enregistrée : ${day}/${month}/----`);
	},
};
