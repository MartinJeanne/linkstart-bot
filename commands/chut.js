const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chut')
		.setDescription("Je dis à quelqu'un de la fermer, il ne saura pas que c'est toi qui à lancé la commande !")
		.addUserOption(option => option.setName('membre')
			.setDescription('La personne qui doit se taire')
			.setRequired(true)),

	async execute(interaction, client) {
		mentionnedUser = interaction.options.getUser('membre');
		const chutSentences = [
			`TA GUEULE ${mentionnedUser}`,
			`Ferme ton clapet ${mentionnedUser}.`,
			`Tais-toi ${mentionnedUser} !`,
			`Ferme ta boîte à camembert ${mentionnedUser}.`,
			`${mentionnedUser}, je crois qu'il faut que tu te taises.`,
			`${mentionnedUser} shhh`,
			`Silence please ${mentionnedUser} !`,
			`Puedes la fermer ${mentionnedUser} ?`
		];

		if (mentionnedUser === interaction.member.user.id) {
			await interaction.reply({ content: "Heu, t'es bizarre fréritot..", ephemeral: true });
		}

		else if (mentionnedUser == client.user.id) {
			await interaction.reply({ content: "Tu t'es pris pour qui ? J'vais te goumer.", ephemeral: true });
		}

		else if (mentionnedUser == '306129521990565888') {
			await interaction.reply({ content: "Es-tu sûr de vouloir faire ça ?", ephemeral: true });
		}

		else {
			await interaction.reply({ content: `Je m'en occupe.`, ephemeral: true });
			const random = Math.floor(Math.random() * chutSentences.length);
			await interaction.channel.send(chutSentences[random]);
		}
	},
};
