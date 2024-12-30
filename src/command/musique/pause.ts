import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import getQueue from '../../service/queue/getQueue';


export default {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause ou relance la musique'),

	async execute(interaction: ChatInputCommandInteraction) {
		const queue = await getQueue(interaction, false);
		if (!queue) return;

		if (queue.node.isPaused()) {
			queue.node.resume();
			await interaction.editReply('▶️ Reprise de la musique');
		}
		else {
			queue.node.pause();
			await interaction.editReply('⏸️ Musique mise en pause');
		}
	}
}
