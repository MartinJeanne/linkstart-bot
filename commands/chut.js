const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chut')
		.setDescription('Say something nice to someone')
		.addUserOption(option => option.setName('user')
			.setDescription('The user that need to shut his mouth')
			.setRequired(false)),

	async execute(interaction) {
		mentionnedUser = interaction.options.getUser('user');

		if (mentionnedUser === interaction.member.user.id) {
			await interaction.reply("Heuu, t'es chelou en vrai fréro.");
		}

		else if (mentionnedUser == '784536536459771925') {
			await interaction.reply("Tu t'es pris pour qui ? J'vais te goumer.");
		}

		else if (mentionnedUser == '306129521990565888') {
			await interaction.reply("Es-tu sûr de vouloir faire ça ?");
		}

		else {
			await interaction.reply(`${mentionnedUser}, je crois qu'il faut que tu te taises.`);
		}
	},
};