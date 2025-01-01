import { SlashCommandBuilder, PermissionsBitField, ChatInputCommandInteraction } from 'discord.js';
import { botCreatorId } from '../../service/user-ids';
import { NoOptionError } from '../../error/generalError/OptionError';
import { NoChannelError } from '../../error/generalError/ChannelError';

export default {
	isEphemeral: true,
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Supprime plusieurs messages')
		.addIntegerOption(option => option.setName('nombre')
			.setDescription('Nombre de messages à supprimer')
			.setRequired(true)),

	async execute(interaction: ChatInputCommandInteraction) {
		function isReadonlyPermissionsBitField(perms: unknown): perms is Readonly<PermissionsBitField> {
			return perms instanceof PermissionsBitField;
		}

		const perms = interaction.member?.permissions;
		if (!perms
			|| !isReadonlyPermissionsBitField(perms)
			|| !perms.has(PermissionsBitField.Flags.Administrator)
			|| interaction.user.id !== botCreatorId) {
			return await interaction.editReply(`:disguised_face: Tu n'es pas admin`);
		}

		const nbToDelete = interaction.options.getInteger('nombre');
		if (!nbToDelete) throw new NoOptionError('nombre');
		const channel = interaction.channel;
		if (!channel) throw new NoChannelError();

		channel.messages.fetch({ limit: nbToDelete, cache: false })
			.then(messages => messages.each(msg => msg.delete()))
			.catch(console.error);

		await interaction.editReply(`Suppression de **${nbToDelete}** messages !`);
	}
}
