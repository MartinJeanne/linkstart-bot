const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stfu')
		.setDescription("Someone need to shut it? Use this command! (He/she will not know that is you who used it!)")
		.addUserOption(option => option.setName('member')
			.setDescription('The person who need to "stop speaking"')
			.setRequired(true)),

	isEphemeral: true,

	async execute(interaction, client) {
		const mentionnedUser = interaction.options.getUser('member');
		const chutSentences = [
			`TA GUEULE ${mentionnedUser}`,
			`Ferme ton clapet ${mentionnedUser}.`,
			`Tais-toi ${mentionnedUser} !`,
			`Ferme ta boîte à camembert ${mentionnedUser}.`,
			`${mentionnedUser}, je crois qu'il faut que tu te taises.`,
			`${mentionnedUser} shhh`,
			`Silence please ${mentionnedUser}!`,
			`STFU ALBREADY ${mentionnedUser}!`,
			`You'r cringing everyone here ${mentionnedUser}, shut up ♥`,
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
			await interaction.editReply({ content: "Hahaha no I don't think so. Not him!", ephemeral: true });
		}

		else {
			await interaction.editReply({ content: `Je m'en occupe.`, ephemeral: true });
			const random = Math.floor(Math.random() * chutSentences.length);
			await interaction.channel.send(chutSentences[random]);
		}
	},
};
