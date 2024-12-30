import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import getQueue from '../../service/queue/getQueue';


export default {
	data: new SlashCommandBuilder()
		.setName('retour')
		.setDescription('Rejoue la dernière musique'),

	async execute(interaction: ChatInputCommandInteraction) {
		const queue = await getQueue(interaction, false);
		if (!queue) return;

		if (!queue.history.previousTrack) return await interaction.editReply('❌ Pas de musique précédente');
		queue.history.back();
		return await interaction.editReply('⏪ Retour à la musique précédente');
	}
}
