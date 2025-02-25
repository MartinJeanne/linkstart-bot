import { SlashCommandBuilder, ComponentType, ChatInputCommandInteraction } from 'discord.js';
import { queueEmbedBuilder, queueRowBuilder } from '../../service/queue/queueEmbedBuilder';
import getQueue from '../../service/queue/getQueue';

export default {
	data: new SlashCommandBuilder()
		.setName('file')
		.setDescription('Affiche la file des musiques'),

	async execute(interaction: ChatInputCommandInteraction) {
		const queue = await getQueue(interaction, false);
		
		let page = 0;
		const embed = queueEmbedBuilder(queue, page);
		const row = queueRowBuilder(queue, page);
		const message = await interaction.editReply({ embeds: [embed], components: row ? [row] : [] });

		const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120_000 });
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
	}
}
