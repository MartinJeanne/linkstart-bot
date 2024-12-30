import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { guildIdsFeur } from '../../service/registerEvents/messageEvents';
import { botCreatorId } from '../../service/user-ids';
import { UnexpectedError } from "../../error/UnexpectedError";


export default {
	data: new SlashCommandBuilder()
		.setName('coiffeur')
		.setDescription('🚨ACTIVE LE COIFFEUR 🚨'),
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

		const gId = interaction.guild?.id;
		if (!gId) throw new UnexpectedError('guild id not there');

		if (guildIdsFeur.includes(gId)) {
			const index = guildIdsFeur.indexOf(gId);
			guildIdsFeur.splice(index, 1);
			await interaction.editReply({ content: 'Coiffeur désactivé 😌' });
		}
		else {
			guildIdsFeur.push(gId);
			await interaction.editReply({ content: '🚨 ALERTE ACTIVATION DU COIFFEUR 🚨' });
		}
	}
}
