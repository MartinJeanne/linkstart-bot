const { SlashCommandBuilder, ComponentType } = require('discord.js');
const { queueEmbedBuilder, queueRowBuilder } = require('../../functions/queueMsgBuilder.js');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Show music queue'),

	async execute(interaction, client) {
		const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
		if (!queue) return;

		let page = 0;
		const embed = queueEmbedBuilder(queue, page);
		const row = queueRowBuilder(queue, page);
		const message = await interaction.editReply({ embeds: [embed], components: row ? [row] : [] });

		const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120000 });
		collector.on('collect', async inter => {

			switch (inter.customId) {
				case 'left':
					if (page <= 0) break;
					page -= 1;
					break;

				case 'right':
					if (page >= Math.ceil(queue.getSize() / 10) - 1) break;
					page += 1;
					break;
			}

			const embed = queueEmbedBuilder(queue, page);
			const row = queueRowBuilder(queue, page);
			await inter.update({ embeds: [embed], components: row ? [row] : [] });
		});

		collector.on('end', () => interaction.deleteReply());
	},
};
