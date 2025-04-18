import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { QueueRepeatMode } from 'discord-player';
import getQueue from '../../service/queue/getQueue';
import { UnexpectedChoiceOptionError } from '../../error/generalError/OptionError';


export default {
	data: new SlashCommandBuilder()
		.setName('boucle')
		.setDescription('Joue de la musique en boucle')
		.addIntegerOption(option => option.setName('mode')
			.setDescription('Sur quoi boucler')
			.setRequired(false)
			.addChoices(
				{ name: 'Aucun', value: QueueRepeatMode.OFF },
				{ name: 'Musique', value: QueueRepeatMode.TRACK },
				{ name: 'File', value: QueueRepeatMode.QUEUE },
			)),

	async execute(interaction: ChatInputCommandInteraction) {
		const queue = await getQueue(interaction, false);

		let loopMode = interaction.options.getInteger('mode');
		if (loopMode == null)
			loopMode = queue.repeatMode == QueueRepeatMode.OFF ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF;

		let reply;
		switch (loopMode) {
			case QueueRepeatMode.OFF:
				reply = '⏹️ Boucle annulé';
				break;

			case QueueRepeatMode.TRACK:
				reply = '🔂 Musique mise en boucle';
				break;

			case QueueRepeatMode.QUEUE:
				reply = '🔁 File mise en boucle';
				break;

			default:
				throw new UnexpectedChoiceOptionError(loopMode);
		}
		queue.setRepeatMode(loopMode);
		return await interaction.editReply(reply);
	}
}
