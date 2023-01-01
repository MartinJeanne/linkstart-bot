const { SlashCommandBuilder } = require('discord.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('retour')
		.setDescription('Rejoue la dernière musique'),

	async execute(interaction, client) {
		// if user is not in channel
		if (!channel)
			return await interaction.editReply(':interrobang: Tu dois être dans un salon vocal pour exécuter cette commande !');
		// if i'm in channel AND user is not in my channel
		else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
			return await interaction.editReply(':interrobang: Tu dois être dans le même salon vocal que moi pour exécuter cette commande !');

		const queue = client.player.getQueue(interaction.guildId);

		if (!queue.previousTracks[1]) return await interaction.editReply('❌ Pas de musique précédente');
		queue.back();
		return await interaction.editReply('⏪ Retour à la musique précédente');
	},
};