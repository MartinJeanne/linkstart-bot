const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('file')
		.setDescription('Affiche la file des musiques'),

	async execute(interaction, client) {
		const queue = await checkPlayerUsable(interaction, client);
		if (!queue) return;

		const loopEmoji = queue.repeatMode == QueueRepeatMode.TRACK ? '🔂' : queue.repeatMode == QueueRepeatMode.QUEUE ? '🔁' : '⏹️';

		const bar = queue.createProgressBar({ queue: false, length: 19, timecodes: true })

		const embed = new EmbedBuilder()
			.setColor(0x6df4d0)
			.setTitle('File de musiques 🎶')
			.addFields({ name: '\u200B', value: `**${queue.nowPlaying().title}**\n${bar}` })
			.setThumbnail(queue.nowPlaying().thumbnail)
			.setTimestamp()
			.setFooter({ text: `Boucle : ${loopEmoji}`, iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128' });

		if (queue.tracks.length == 0) return await interaction.editReply({ embeds: [embed] });
		
		const musicNb = queue.tracks.length > 10 ? 10 : queue.tracks.length;
		
		let queueString = '';
		for (let i = 0; i < musicNb; i++) {
			queueString += `**${i + 1}.** ${queue.tracks[i].title}\n`
		}

		embed.addFields({ name: '\u200B', value: queueString });
		await interaction.editReply({ embeds: [embed] });
	},
};