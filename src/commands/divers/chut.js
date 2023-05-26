const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chut')
		.setDescription("Dis à quelqu'un de se taire, il ne saura pas que c'est toi qui a lancé la commande !")
		.addUserOption(option => option.setName('membre')
			.setDescription('La personne qui doit se taire')
			.setRequired(true)),

	isEphemeral: true,

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
			`Puedes la fermer ${mentionnedUser} ?`,
			`${mentionnedUser} :zipper_mouth: :zipper_mouth:`,
			`${mentionnedUser} :shushing_face:`,
			`Nan ? Sérieux ?! Bon tg maintenant ${mentionnedUser}.`
		];

		if (mentionnedUser === interaction.member.user.id) {
			await interaction.editReply({ content: "Heu, t'es bizarre fréritot..", ephemeral: true });
		}

		else if (mentionnedUser == client.user.id) {
			await interaction.editReply({ content: "Tu t'es pris pour qui ? J'vais te goumer.", ephemeral: true });
		}

		else if (mentionnedUser == '306129521990565888') {
			await interaction.editReply({ content: "Hahaha non je crois pas non, c'est mon créateur lui :stuck_out_tongue_winking_eye:", ephemeral: true });
		}

		else {
			await interaction.editReply({ content: `Je m'en occupe.`, ephemeral: true });
			const random = Math.floor(Math.random() * chutSentences.length);
			await interaction.channel.send(chutSentences[random]);
		}
	},
};
