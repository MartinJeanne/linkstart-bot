const { SlashCommandBuilder } = require('discord.js');
const { Track, Playlist } = require('discord-player');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Joue ou sauvegarde une playlist !'),

    async execute(interaction, client) {
        const queue = await checkPlayerUsable(interaction, client);
        if (!queue) return;

        if (queue.tracks.length < 2) return await interaction.editReply(':interrobang: Il doit y avoir au moins deux musiques dans la file pour créer une playlist');

        //await interaction.editReply('Playlist crée avec comme nom : TODO');
        await interaction.editReply('Commande pas encore implémenté');

        // TODO save my own tracks en playlists in my database
        const track = new Track(client.player, {
            title: string,
            description: string,
            author: string,
            url: string,
            thumbnail: string,
            duration: string,
            views: number,
            requestedBy: User,
        });

        const playlist = new Playlist(client.player, {
            tracks: [Track],
            title: string,
            description: string,
            thumbnail: string,
            type: "album" | "playlist",
            source: TrackSource,
            author: {
                name: string,
                url: string,
            },
            id: string,
            url: string,
        });
    },
};
