const { SlashCommandBuilder } = require('discord.js');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Joue ou sauvegarde une playlist !'),

    // TODO
    async execute(interaction, client) {
        const queue = await checkPlayerUsable(interaction, client);
        if (!queue) return;

        if (queue.tracks.length < 2) return await interaction.editReply(':interrobang: Il doit y avoir au moins deux musiques dans la file pour créer une playlist');

        //await interaction.editReply('Playlist crée avec comme nom : TODO');
        await interaction.editReply('Commande pas encore implémenté');
    },
};
