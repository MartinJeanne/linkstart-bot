const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Supprime plusieurs messages')
		.addIntegerOption(option => option.setName('nombre')
			.setDescription('Nombre de message à supprimer')
			.setRequired(true)),

	isEphemeral: true,

	async execute(interaction) {
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
