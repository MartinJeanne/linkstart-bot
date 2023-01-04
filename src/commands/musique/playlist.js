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

        if (queue.tracks.length < 1) return await interaction.editReply(':interrobang: Il doit y avoir au moins deux musiques dans la file pour créer une playlist');
        
        // TODO save my own tracks en playlists in my database
        const track = new Track(client.player, {
            title: 'super titre',
            description: 'super petite description ça',
            author: 'moi askip',
            url: 'https://www.youtube.com/watch?v=LOOnXFNJxdI',
            thumbnail: 'https://i3.ytimg.com/vi/LOOnXFNJxdI/maxresdefault.jpg',
            duration: '1:01',
            views: 1000,
            requestedBy: interaction.member.user,
            source: "youtube"
        });

        queue.addTrack(track);
        await interaction.editReply('Ajouté : ' + track.title);
        console.log(queue.tracks);
    },
};

/*
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
*/