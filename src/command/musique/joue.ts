import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import playSavedMusic from '../../service/joue/playSavedMusic';


export default {
	data: new SlashCommandBuilder()
		.setName('joue')
		.setDescription('Joue de la musique')
		.setDescription('Affiche le choix des musiques enregistrées sur le bot'),

	async execute(interaction: ChatInputCommandInteraction) {
		const embed = await playSavedMusic(interaction);
		await interaction.editReply({ embeds: [embed], content: 'Écris dans le channel le nombre associé à la musique que tu veux écouter' });
	}
}
