const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('file')
		.setDescription('Affiche la file des musiques'),

	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true }); // make Discord API wait for reply

		const queue = await checkPlayerUsable(interaction, client);
		if (!queue) return;

		let loopEmoji = queue.repeatMode == QueueRepeatMode.TRACK ? '🔂' : queue.repeatMode == QueueRepeatMode.QUEUE ? '🔁' : '🛑';

		let embed = new EmbedBuilder()
			.setColor(0x6df4d0)
			.setTitle('File des musiques 🎶')
			.addFields({ name: 'Actuelle', value: queue.nowPlaying().toString() })
			.setTimestamp()
			.setFooter({ text: `Boucle : ${loopEmoji}`, iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128' });

		for (let i = 0; i < queue.tracks.length; i++) {
			embed.addFields({ name: `${i + 1}.`, value: queue.tracks[i].toString() })
		}

		return await interaction.editReply({ embeds: [embed] });
	},
};