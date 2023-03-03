const { SlashCommandBuilder } = require('discord.js');
const getQueue = require('../../functions/getQueue.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('supp')
        .setDescription('Supprime une musique de la file')
        .addIntegerOption(option => option.setName('position')
            .setDescription('Position de la musique dans la file')
            .setRequired(true)),

    async execute(interaction, client) {
        const queue = await getQueue({interaction: interaction, client: client, canCreate: false});
        if (!queue) return;

        const index = interaction.options.getInteger('position');
        const tracks = queue.tracks.toArray();
        const deletedSong = queue.node.remove(tracks[index - 1]);
        if (!deletedSong) await interaction.editReply(`:interrobang: Aucune musique à cette position\n**/file** pour avoir la liste des musiques`);
        else await interaction.editReply(`:broom: Musique supprimé : **${deletedSong.title}**`);
    },
};
