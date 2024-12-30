import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import getQueue from '../../service/queue/getQueue';
import { ClientEx } from '../../model/Client';

export default {
	data: new SlashCommandBuilder()
		.setName('suivant')
		.setDescription('Passe à la musique suivante'),

	async execute(interaction: ChatInputCommandInteraction, client: ClientEx) {
		const queue = await getQueue(interaction, false);
		if (!queue) return;

		const nextSong = queue.history.nextTrack;
		if (!nextSong || !nextSong.title) return await interaction.editReply(`⏩ Musique passée`);
		queue.node.skip();
		await interaction.editReply(`⏩ Musique passée, je joue : **${nextSong.title}**`);
	}
}
