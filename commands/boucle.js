const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('boucle')
		.setDescription('Joue la musique actuelle en boucle')
		.addIntegerOption(option => option.setName('mode')
			.setDescription('Sur quoi boucler')
			.setRequired(false)
			.addChoices(
				{ name: 'Aucun', value: QueueRepeatMode.OFF },
				{ name: 'Musique', value: QueueRepeatMode.TRACK },
				{ name: 'File', value: QueueRepeatMode.QUEUE },
			)),

	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true }); // make Discord API wait for reply

		const channel = interaction.member.voice.channel;
		// if user is not in channel
		if (!channel)
			return await interaction.editReply('Tu dois être dans un salon vocal pour exécuter cette commande !');
		// if i'm in channel AND user is not in my channel
		else if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId)
			return await interaction.editReply('Tu dois être dans le même salon vocal que moi pour exécuter cette commande !');


		const queue = client.player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return await interaction.editReply('Je ne joue pas de musique actuellement !');

		let response;
		let loopMode = interaction.options.getInteger('mode');
		if (loopMode == null) {
			if (queue.repeatMode == QueueRepeatMode.OFF) {
				loopMode = QueueRepeatMode.TRACK;
				response = '🔂 Musique mise en boucle';
			} else {
				loopMode = QueueRepeatMode.OFF;
				response = '🛑 Boucle annulé';
			}
		}
		else if (loopMode == QueueRepeatMode.OFF) {
			response = '🛑 Boucle annulé';
		}
		else if (loopMode == QueueRepeatMode.TRACK) {
			response = '🔂 Musique mise en boucle';
		}
		else if (loopMode == QueueRepeatMode.QUEUE) {
			response = '🔁 File mise en boucle';
		}
		queue.setRepeatMode(loopMode);
		return await interaction.editReply(response);
		
	},
};