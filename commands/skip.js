const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Passe la musique en cours'),

	async execute(interaction, client) {
		const queue = client.player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return await interaction.reply({ content: 'Je ne joue pas de musique actuellement !', ephemeral: true });
		queue.skip();
		return await interaction.reply({content: 'Je skip !', ephemeral: true });
	},
};