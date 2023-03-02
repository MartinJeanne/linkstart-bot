const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suivant')
		.setDescription('Passe à la musique suivante'),

	async execute(interaction, client) {
		const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
		if (!queue) return;

		const nextSong = queue.history.nextTrack;
		await queue.node.skip();
		return await interaction.editReply(`⏩ Suivant, musique actuelle : **${nextSong.title}**`);
	},
};
