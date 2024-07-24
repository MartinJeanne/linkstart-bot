const { SlashCommandBuilder, PermissionsBitField  } = require('discord.js');
const { guildIdsFeur } = require('../../functions/registerEvents/messageEvents');
const { botCreatorId } = require('../../functions/user-ids');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coiffeur')
		.setDescription('🚨ACTIVE LE COIFFEUR 🚨'),
	async execute(interaction) {
		if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator) 
		&& interaction.member.id != botCreatorId)
			return await interaction.editReply("T'es pas admin :disguised_face:");

		if (guildIdsFeur.includes(interaction.guild.id)) {
			const index = guildIdsFeur.indexOf(interaction.guild.id);
			guildIdsFeur.splice(index, 1);
			await interaction.editReply({ content: 'Coiffeur désactivé 😌' });
		}
		else {
			guildIdsFeur.push(interaction.guild.id);
			await interaction.editReply({ content: '🚨 ALERTE ACTIVATION DU COIFFEUR 🚨' });
		}
	}
}
