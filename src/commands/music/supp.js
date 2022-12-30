const { SlashCommandBuilder } = require('discord.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('supp')
        .setDescription('Supprime une musique de la file')
        .addIntegerOption(option => option.setName('position')
            .setDescription('Position de la musique dans la file')
            .setRequired(true)),

    async execute(interaction, client) {
        await interaction.deferReply(); // make Discord API wait for reply

        const queue = await checkPlayerUsable(interaction, client);
        if (!queue) return;

        const index = interaction.options.getInteger('position');
        const rmSong = queue.remove(queue.tracks[index - 1]);
        if (!rmSong) await interaction.editReply(`:interrobang: Aucune musique à cette position\n**/file** pour avoir la liste des musiques`);
        else await interaction.editReply(`:broom: Musique supprimé : **${rmSong}**`);
    },
};