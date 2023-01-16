const { SlashCommandBuilder } = require('discord.js');
const checkPlayerPlaying = require('../../functions/checkPlayerPlaying.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mélange')
        .setDescription('Mélange les musiques'),

    async execute(interaction, client) {
        const queue = await checkPlayerPlaying(interaction, client);
        if (!queue) return;

        if (queue.tracks.length < 2) return await interaction.editReply(`:interrobang: Pas assez de musique pour mélanger la file`);
        queue.shuffle();
        await interaction.editReply(`:twisted_rightwards_arrows: File mélangé !`);
    },
};
