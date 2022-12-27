const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('file')
		.setDescription('Affiche la file des musiques'),

	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true }); // make Discord API wait for reply

		const channel = interaction.member.voice.channel;
		// if user is not in channel
		if (!channel)
			return await interaction.editReply('Tu dois être dans un salon vocal pour exécuter cette commande !');
		// if i'm in channel AND user is not in my channel
		else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
			return await interaction.editReply('Tu dois être dans le même salon vocal que moi pour exécuter cette commande !');

		// TODO tracks or nowPlaying
		const queue = client.player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return await interaction.editReply('Je ne joue pas de musique actuellement !');

		let embed = new EmbedBuilder()
			.setColor(0xf8377b)
			.setTitle('File des musiques')
			.addFields({ name: 'Actuelle', value: queue.nowPlaying().toString() })
			.setTimestamp()
			.setFooter({ text: 'Bonne écoute !', iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128' });

		for (let i = 0; i < queue.tracks.length; i++) {
			embed.addFields({ name: `${i + 1}.`, value: queue.tracks[i].toString() })
		}

		return await interaction.editReply({ embeds: [embed] });
	},
};