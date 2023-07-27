const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Supprime plusieurs messages')
		.addIntegerOption(option => option.setName('nombre')
			.setDescription('Nombre de message à supprimer')
			.setRequired(true)),

	isEphemeral: true,

	// TODO security
	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
			&& interaction.member.id !== '306129521990565888') {
			return await interaction.editReply({ content: `Tu n'as pas la permission de faire ça !`, ephemeral: true });
		}

		const nbToDelete = interaction.options.getInteger('nombre');
		const channel = interaction.channel;

		await channel.messages.fetch({ limit: nbToDelete, cache: false })
			.then(messages => {
				messages.each(msg => channel.messages.delete(msg))
			})
			.catch(console.error);

		await interaction.editReply({ content: `**${nbToDelete}** messages supprimés !`, ephemeral: true });
	},
};	
