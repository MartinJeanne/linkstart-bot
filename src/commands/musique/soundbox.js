const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, QueryType } = require('discord-player');
const { soundboxEmbedBuilder } = require('../../functions/sounboxEmbedBuilder.js');
const { addSongToQueue } = require('../../functions/queue/addSongsToQueue.js');
const getQueue = require('../../functions/queue/getQueue.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('soundbox')
		.setDescription('Lance un son'),


	async execute(interaction, client) {
		const player = useMainPlayer();
		const queue = await getQueue({ interaction: interaction, client: client, canCreate: true });
		if (!queue) return;

		let page = 0;
		const files = fs.readdirSync(`soundbox-files`).filter(file => file.endsWith('.mp3'));
		const embed = soundboxEmbedBuilder(files, page);
		await interaction.editReply({ embeds: [embed] });

		const collectorFilter = m => m.author.id === interaction.user.id && Number.isInteger(parseInt(m.content));
		const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 300_000 });

		collector.on('collect', async m => {
			const i = parseInt(m.content) - 1; // Song index

			const result = await player.search(`soundbox-files/${files[i]}`, {
				requestedBy: m.author,
				searchEngine: QueryType.FILE,
			});

			try {
				const reply = addSongToQueue(result.tracks[0], queue);
				await m.reply(reply);
			} catch (error) {
				console.error(error);
				await m.reply('❌ Erreur lors de la lecture de la musique');
			}
		});

		collector.on('end', async collected => {
			interaction.deleteReply();
		});
	},
};
