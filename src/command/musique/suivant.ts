import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { QueueRepeatMode } from 'discord-player';
import getQueue from '../../service/queue/getQueue';
import { TrackLoopNotSkipableError } from '../../error/botMisuseError/SkipError';


export default {
	data: new SlashCommandBuilder()
		.setName('suivant')
		.setDescription('Passe à la musique suivante'),

	async execute(interaction: ChatInputCommandInteraction) {
		const queue = await getQueue(interaction, false);

		const nextSong = queue.history.nextTrack;
		if (queue.repeatMode === QueueRepeatMode.TRACK) throw new TrackLoopNotSkipableError();
		if (!nextSong || !nextSong.title) return await interaction.editReply(`⏩ Musique passée`);
		queue.node.skip();
		await interaction.editReply(`⏩ Musique passée, je joue : **${nextSong.title}**`);
	}
}
