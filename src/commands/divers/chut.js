const { SlashCommandBuilder } = require('discord.js');
const { botCreatorId } = require('../../functions/user-ids');

module.exports = {
	isEphemeral: true,
	data: new SlashCommandBuilder()
		.setName('chut')
		.setDescription("Dis à quelqu'un de se taire, il ne saura pas que c'est toi qui a lancé la commande !")
		.addUserOption(option => option.setName('membre')
			.setDescription('La personne qui doit se taire')
			.setRequired(true)),

	async execute(interaction, client) {
		const mentionnedUser = interaction.options.getUser('membre');
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

		if (mentionnedUser === interaction.member.user.id) {
			await interaction.editReply("Heu, t'es bizarre fréritot...");
		}

		else if (mentionnedUser == client.user.id) {
			await interaction.editReply("Tu t'es pris pour qui ? J'vais te goumer.");
		}

		else if (mentionnedUser == botCreatorId) {
			await interaction.editReply("Hahaha non je crois pas non, c'est mon créateur lui :stuck_out_tongue_winking_eye:");
		}

		else {
			await interaction.editReply(`Je m'en occupe.`);
			const random = Math.floor(Math.random() * chutSentences.length);
			await interaction.channel.send(chutSentences[random]);
		}
	},
}
