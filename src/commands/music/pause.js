const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause ou relance la musique'),

	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true }); // make Discord API wait for reply

		const channel = interaction.member.voice.channel;
		// if user is not in channel
		if (!channel)
			return await interaction.editReply('Tu dois être dans un salon vocal pour exécuter cette commande !');
		// if i'm in channel AND user is not in my channel
		else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
			return await interaction.editReply('Tu dois être dans le même salon vocal que moi pour exécuter cette commande !');


		const queue = client.player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return await interaction.editReply('Je ne joue pas de musique actuellement !');
		if (queue.setPaused()) {
			queue.setPaused(false)
			return await interaction.editReply('▶️ Reprise de la musique');
		}
		else {
			queue.setPaused(true);
			return await interaction.editReply('⏸️ Musique en pause');
		}
	},
};