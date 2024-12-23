const { SlashCommandBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueryType } = require('discord-player');
const { useMainPlayer } = require('discord-player');
const fs = require('node:fs');
const getQueue = require('../../functions/getQueue.js');

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

		const row = new ActionRowBuilder().addComponents(...buttons);
		const message = await interaction.editReply({ content: 'Quel son veux-tu jouer ?', components: [row] });

		const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
		collector.on('collect', async btnInter => {
			await btnInter.deferUpdate();
			const queue = await getQueue({ interaction: interaction, client: client, canCreate: true });
			if (!queue) return;


			const player = useMainPlayer();
			const result = await player.search('soundbox-files/' + btnInter.customId, {
				requestedBy: btnInter.user,
				searchEngine: QueryType.FILE,
			});

			try {
				const track = result.tracks[0];
				queue.addTrack(track);
				await interaction.editReply(`▶️ **Je joue :** ${btnInter.customId.slice(0, -4)}`);
			} catch (error) {
				console.error(error);
				await interaction.editReply('❌ Oups, erreur lors de la lecture de la musique');
			}

			if (!queue.isPlaying()) await queue.node.play();
			//collector.stop();
		});
	}
}
