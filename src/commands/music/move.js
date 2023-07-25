const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move music to a new position in queue')
        .addIntegerOption(option =>
            option.setName('music')
                .setDescription('Position of music to move')
                .setMinValue(1)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Position where to move')
                .setMinValue(1)
                .setRequired(true)),

    async execute(interaction, client) {
        const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
        if (!queue) return;

        const index = interaction.options.getInteger('music') - 1;
        const position = interaction.options.getInteger('position') - 1;

        if (index > queue.getSize() - 1 || position > queue.getSize() - 1)
            return await interaction.editReply(`:interrobang: Music position invalid, number of music in queue: **${queue.getSize()}**`);
        else if (position === index)
            return await interaction.editReply(`:interrobang: Current and futur music position can't be the same! :sparkles:`);

        const track = queue.tracks.toArray()[index];

        queue.removeTrack(track);
        queue.insertTrack(track, position);

        await interaction.editReply(':arrow_heading_down: Music moved!');
    },
};
