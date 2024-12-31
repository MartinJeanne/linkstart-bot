import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import deezer from '../../service/joue/deezer';
import { NoOptionError } from '../../error/NoOptionError';
import savedMusic from '../../service/joue/savedMusic';


export default {
	data: new SlashCommandBuilder()
		.setName('joue')
		.setDescription('Joue de la musique')
		.addSubcommand(subcommand => subcommand.setName('deezer')
			.setDescription('Joue une musique depuis Deezer')
			.addStringOption(option => option.setName('musique')
				.setDescription('Nom de la musique')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand.setName('enregistrement')
			.setDescription('Affiche le choix des musiques enregistrées sur le bot')),

	async execute(interaction: ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'deezer') {
			const toSearch = interaction.options.getString('musique');
			if (!toSearch) throw new NoOptionError('musique');
			const reply = await deezer(interaction, toSearch);
			await interaction.editReply(reply);
		}
		else if (subcommand === 'enregistrement') {
			const embed = await savedMusic(interaction);
			await interaction.editReply({ embeds: [embed], content: 'Écris dans le channel le nombre associé à la musique que tu veux écouter' });
		}
	}
}