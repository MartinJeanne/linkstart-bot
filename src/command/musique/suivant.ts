import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import getQueue from '../../service/queue/getQueue';

export default {
	data: new SlashCommandBuilder()
		.setName('suivant')
		.setDescription('Passe à la musique suivante'),

	async execute(interaction: ChatInputCommandInteraction) {
		const queue = await getQueue(interaction, false);

		const nextSong = queue.history.nextTrack;
		if (!nextSong || !nextSong.title) return await interaction.editReply(`⏩ Musique passée`);
		queue.node.skip();
		await interaction.editReply(`⏩ Musique passée, je joue : **${nextSong.title}**`);
	}
}
