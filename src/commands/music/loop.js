const { SlashCommandBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Play music in loop')
		.addIntegerOption(option => option.setName('mode')
			.setDescription('Loop mode')
			.setRequired(false)
			.addChoices(
				{ name: 'Aucun', value: QueueRepeatMode.OFF },
				{ name: 'Musique', value: QueueRepeatMode.TRACK },
				{ name: 'File', value: QueueRepeatMode.QUEUE },
			)),

	async execute(interaction, client) {
		const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
		if (!queue) return;

		let loopMode = interaction.options.getInteger('mode');
		if (loopMode == null) {
			loopMode = queue.repeatMode == QueueRepeatMode.OFF ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF;
		}

		let response;
		switch (loopMode) {
			case QueueRepeatMode.OFF:
				response = '⏹️ Loop canceled';
				break;

			case QueueRepeatMode.TRACK:
				response = '🔂 Music now in loop';
				break; 
			
			case QueueRepeatMode.QUEUE:
				response = '🔁 Queue now in loop';
				break;
		}
		queue.setRepeatMode(loopMode);
		return await interaction.editReply(response);

	},
};
