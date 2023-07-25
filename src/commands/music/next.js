const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next')
		.setDescription('Go to next music'),

	async execute(interaction, client) {
		const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
		if (!queue) return;

		const nextSong = queue.history.nextTrack;
		await queue.node.skip();
		return await interaction.editReply(`⏩ Next: **${nextSong.title}**`);
	},
};
