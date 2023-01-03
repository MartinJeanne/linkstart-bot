const { SlashCommandBuilder, ComponentType } = require('discord.js');
const { queueEmbedBuilder, queueRowBuilder } = require('../../functions/queueMessageBuilder.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('file')
		.setDescription('Affiche la file des musiques'),

	async execute(interaction, client) {
		const queue = await checkPlayerUsable(interaction, client);
		if (!queue) return;

		let page = 0;
		const embed = await queueEmbedBuilder(queue, page);
		const row = await queueRowBuilder(queue, page);
		const message = await interaction.editReply({ embeds: [embed], components: row ? [row] : [] });

		const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
		collector.on('collect', async interaction => {

			switch (interaction.customId) {
				case 'left':
					if (page <= 0) break;
					page -= 1;
					break;

				case 'right':
					if (page >= Math.ceil(queue.tracks.length / 10) - 1) break;
					page += 1;
					break;
			}

			const embed = await queueEmbedBuilder(queue, page);
			const row = await queueRowBuilder(queue, page);
			await interaction.update({ embeds: [embed], components: row ? [row] : [] });
		});
	},
};
