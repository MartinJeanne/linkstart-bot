const { SlashCommandBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
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

	async execute(interaction, client) {
		const queue = await checkPlayerUsable(interaction, client);
		if (!queue) return;

		let loopMode = interaction.options.getInteger('mode');
		if (loopMode == null) {
			loopMode = queue.repeatMode == QueueRepeatMode.OFF ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF
		}

		let response;
		switch (loopMode) {
			case QueueRepeatMode.OFF:
				response = '⏹️ Boucle annulé';
				break;

			case QueueRepeatMode.TRACK:
				response = '🔂 Musique mise en boucle';
				break; 
			
			case QueueRepeatMode.QUEUE:
				response = '🔁 File mise en boucle';
				break;
		}
		queue.setRepeatMode(loopMode);
		return await interaction.editReply(response);

	},
};
