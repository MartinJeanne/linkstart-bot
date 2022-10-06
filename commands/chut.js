const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chut')
		.setDescription('Fait comprendre à quelqu\'un qui doit la fermer')
		.addUserOption(option => option.setName('user')
			.setDescription('The user that need to shut his mouth')
			.setRequired(true)),

	async execute(interaction) {
		mentionnedUser = interaction.options.getUser('user');
		const chutSentence = [
			`TA GUEULE ${mentionnedUser}`, 
			`Ferme ton clapet ${mentionnedUser}.`, 
			`Tais-toi ${mentionnedUser} !`, 
			`Ferme ta boîte à camembert ${mentionnedUser}.`, 
			`${mentionnedUser}, je crois qu'il faut que tu te taises.`
		];

		if (mentionnedUser === interaction.member.user.id) {
			await interaction.reply("Heu, t'es bizarre fréritot..");
		}

		else if (mentionnedUser == '784536536459771925') {
			await interaction.reply("Tu t'es pris pour qui ? J'vais te goumer.");
		}

		else if (mentionnedUser == '306129521990565888') {
			await interaction.reply("Es-tu sûr de vouloir faire ça ?");
		}

		else {
			await interaction.reply({ content: `Je m'en occupe.`, ephemeral: true});
			const random = Math.floor(Math.random() * chutSentence.length);
			await interaction.channel.send(chutSentence[random]);
		}
	},
};