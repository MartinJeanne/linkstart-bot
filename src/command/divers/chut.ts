import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import { NoOptionError } from '../../error/generalError/OptionError';
import { NoClientUserError } from '../../error/generalError/ClientUserError';
const { botCreatorId } = require('../../service/user-ids');


export default {
	isEphemeral: true,
	data: new SlashCommandBuilder()
		.setName('chut')
		.setDescription("Dis à quelqu'un de se taire, il ne saura pas que c'est toi qui a lancé la commande !")
		.addUserOption(option => option.setName('membre')
			.setDescription('La personne qui doit se taire')
			.setRequired(true)),

	async execute(interaction: ChatInputCommandInteraction) {
		const mentionnedUser = interaction.options.getUser('membre');
		if (!mentionnedUser) throw new NoOptionError('membre');

		const chutSentences = [
			`TA GUEULE ${mentionnedUser}`,
			`Ferme ton clapet ${mentionnedUser}.`,
			`Tais-toi ${mentionnedUser} !`,
			`Ferme ta boîte à camembert ${mentionnedUser}.`,
			`${mentionnedUser}, je crois qu'il faut que tu te taises.`,
			`${mentionnedUser} shhh`,
			`Silence please ${mentionnedUser} !`,
			`Puedes la fermer por favor ${mentionnedUser} ?`,
			`${mentionnedUser} :zipper_mouth: :zipper_mouth:`,
			`${mentionnedUser} :shushing_face:`,
			`Nan ? Sérieux ?! Bon tg maintenant ${mentionnedUser}.`
		];

		if (mentionnedUser.id === interaction.user.id) {
			await interaction.editReply("Heu, t'es bizarre fréritot...");
		}

		if (!interaction.client.user) throw new NoClientUserError();
		else if (mentionnedUser.id == interaction.client.user.id) {
			await interaction.editReply("Tu t'es pris pour qui ? J'vais te goumer.");
		}

		else if (mentionnedUser == botCreatorId) {
			await interaction.editReply("Hahaha non je crois pas non, c'est mon créateur lui :stuck_out_tongue_winking_eye:");
		}

		else {
			await interaction.editReply(`Je m'en occupe.`);
			const random = Math.floor(Math.random() * chutSentences.length);
			const c = interaction.channel as TextChannel
			c.send(chutSentences[random]);
		}
	}
}
