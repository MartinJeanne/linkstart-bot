import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Joue au ping pong'),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.editReply('Pong !');
	}
}
