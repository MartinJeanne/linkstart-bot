const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { botCreatorId } = require('../../service/user-ids');

module.exports = {
	isEphemeral: true,
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Supprime plusieurs messages')
		.addIntegerOption(option => option.setName('nombre')
			.setDescription('Nombre de messages à supprimer')
			.setRequired(true)),

	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
			&& interaction.member.id !== botCreatorId) {
			return await interaction.editReply(`T'es pas admin :disguised_face:`);
		}

		const nbToDelete = interaction.options.getInteger('nombre');
		const channel = interaction.channel;

		channel.messages.fetch({ limit: nbToDelete, cache: false })
			.then(messages => messages.each(msg => msg.delete()))
			.catch(console.error);

		await interaction.editReply(`Suppression de **${nbToDelete}** messages !`);
	},
};
