const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop la musique'),

	async execute(interaction, client) {
		const queue = client.player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return await interaction.reply('Je ne joue pas de musique actuellement !');
		queue.destroy();
		return await interaction.reply({content: 'Tchao !', ephemeral: true });
	},
};