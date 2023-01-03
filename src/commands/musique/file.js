const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const createQueueEmbed = require('../../functions/createQueueEmbed.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('file')
		.setDescription('Affiche la file des musiques'),

	async execute(interaction, client) {
		const queue = await checkPlayerUsable(interaction, client);
		if (!queue) return;

		// TODO improve button style
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('left')
					.setLabel('⬅️')
					.setStyle(ButtonStyle.Primary),

				new ButtonBuilder()
					.setCustomId('right')
					.setLabel('➡️')
					.setStyle(ButtonStyle.Primary),
			);

		let page = 0;
		const embed = await createQueueEmbed(queue, page);
		const message = await interaction.editReply({ embeds: [embed], components: queue.tracks.length > 10 ? [row] : [] });

		const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
		collector.on('collect', async interaction => {

			switch (interaction.customId) {
				case 'right':
					if (page >= Math.ceil(queue.tracks.length / 10) - 1) break;
					page += 1;
					break;
				case 'left':
					if (page <= 0) break;
					page -= 1;
					break;
			}

			const embed = await createQueueEmbed(queue, page);
			await interaction.update({ embeds: [embed] });
		});
	},
};