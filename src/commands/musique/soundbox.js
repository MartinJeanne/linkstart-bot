const fs = require('node:fs');
const { SlashCommandBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { useMainPlayer, QueryType } = require('discord-player');
const { soundboxEmbedBuilder, soundboxRowBuilder } = require('../../functions/sounboxEmbedBuilder.js');
const getQueue = require('../../functions/queue/getQueue.js');
const { addSongToQueue } = require('../../functions/queue/addSongsToQueue.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('soundbox')
		.setDescription('Joue un son du bot'),

	async execute(interaction, client) {
		const buttons = [];
		const files = fs.readdirSync(`soundbox-files`).filter(file => file.endsWith('.mp3'));
		for (const file of files) {
			buttons.push(
				new ButtonBuilder()
					.setCustomId(String(file))
					.setLabel(file.slice(0, -4))
					.setStyle(ButtonStyle.Primary)
			);
		}
		
		let page = 0;
		const embed = soundboxEmbedBuilder(files, page);
		const row = soundboxRowBuilder(files, page);
		const message = await interaction.editReply({ embeds: [embed], components: row ? [row] : [] });

		const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000 });

		const queue = await getQueue({ interaction: interaction, client: client, canCreate: true });
		if (!queue) return;
		
		collector.on('collect', async btnInter => {
			await btnInter.deferUpdate();

			const player = useMainPlayer();
			const result = await player.search('soundbox-files/' + btnInter.customId, {
				requestedBy: btnInter.user,
				searchEngine: QueryType.FILE,
			});

			try {
				const reply = addSongToQueue(result.tracks[0], queue);
				await btnInter.followUp(reply);
			} catch (error) {
				console.error(error);
				await btnInter.followUp('❌ Erreur lors de la lecture de la musique');
			}
			//collector.stop();
		});

		collector.on('end', collected => {
			interaction.deleteReply();
		});
	}
}
