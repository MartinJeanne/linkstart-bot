import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ClientEx } from "../../model/Client";
import getQueue from '../../service/queue/getQueue';


export default {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop la musique'),

	async execute(interaction: ChatInputCommandInteraction, client: ClientEx) {
		const queue = await getQueue(interaction, false);
		if (!queue) return;

		queue.delete();
		return await interaction.editReply('⏹️ Tschüss!');
	},
};
