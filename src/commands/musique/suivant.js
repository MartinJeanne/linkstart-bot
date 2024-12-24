const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../functions/queue/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suivant')
		.setDescription('Passe à la musique suivante'),

	async execute(interaction, client) {
		const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
		if (!queue) return;

		const nextSong = queue.history.nextTrack;
		if (!nextSong || !nextSong.title) return await interaction.editReply(`⏩ Musique passée`);
		await queue.node.skip();
		await interaction.editReply(`⏩ Musique passée, je joue : **${nextSong.title}**`);
	},
};
