const { SlashCommandBuilder } = require('discord.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mélange')
        .setDescription('Mélange les musiques'),

    async execute(interaction, client) {
        await interaction.deferReply(); // make Discord API wait for reply

        const queue = await checkPlayerUsable(interaction, client);
        if (!queue) return;

        queue.shuffle();
        await interaction.editReply(`:twisted_rightwards_arrows: file mélangé`);
    },
};