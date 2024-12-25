const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../service/queue/getQueue.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mélange')
        .setDescription('Mélange les musiques'),

    async execute(interaction, client) {
        const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
        if (!queue) return;

        if (queue.getSize() < 2) return await interaction.editReply(`:interrobang: Pas assez de musique pour mélanger la file`);
        queue.tracks.shuffle();
        await interaction.editReply(`:twisted_rightwards_arrows: File mélangé !`);
    },
};
