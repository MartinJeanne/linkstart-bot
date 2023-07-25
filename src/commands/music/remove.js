const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Delete a music from queue')
        .addIntegerOption(option => option.setName('position')
            .setDescription('Position of music to delete')
            .setRequired(true)),

    async execute(interaction, client) {
        const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
        if (!queue) return;

        const index = interaction.options.getInteger('position');
        const tracks = queue.tracks.toArray();
        const deletedSong = queue.node.remove(tracks[index - 1]);
        if (!deletedSong) await interaction.editReply(`:interrobang: No music at this position`);
        else await interaction.editReply(`:broom: Musique removed: **${deletedSong.title}**`);
    },
};
