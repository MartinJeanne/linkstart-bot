const { SlashCommandBuilder } = require('discord.js');
const checkPlayerPlaying = require('../../functions/checkPlayerPlaying.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('supp')
        .setDescription('Supprime une musique de la file')
        .addIntegerOption(option => option.setName('position')
            .setDescription('Position de la musique dans la file')
            .setRequired(true)),

    async execute(interaction, client) {
        const queue = await checkPlayerPlaying(interaction, client);
        if (!queue) return;

        const index = interaction.options.getInteger('position');
        const deletedSong = queue.remove(queue.tracks[index - 1]);
        if (!deletedSong) await interaction.editReply(`:interrobang: Aucune musique à cette position\n**/file** pour avoir la liste des musiques`);
        else await interaction.editReply(`:broom: Musique supprimé : **${deletedSong.title}**`);
    },
};
