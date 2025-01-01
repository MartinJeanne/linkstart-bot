import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import getQueue from '../../service/queue/getQueue';


export default {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop la musique'),

	async execute(interaction: ChatInputCommandInteraction) {
		const queue = await getQueue(interaction, false);

		queue.delete();
		return await interaction.editReply('⏹️ Tschüss!');
	},
};
