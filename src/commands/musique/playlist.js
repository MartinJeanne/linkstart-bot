const { SlashCommandBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueryType, Track, Playlist } = require('discord-player');
const { default: axios } = require('axios');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Joue ou sauvegarde une playlist !')
        .addSubcommand(subcommand => subcommand.setName('ajouter')
            .setDescription('Ajoute une playlist existante')
            .addStringOption(option => option.setName('url').setDescription('Le lien de la playlist')
                .setRequired(true))
            .addStringOption(option => option.setName('nom').setDescription('Nom de la playlist')))
        .addSubcommand(subcommand => subcommand.setName('jouer')
            .setDescription('Joue une playlist !')),

    async execute(interaction, client) {
        const playlists = 'http://127.0.0.1:8081/api/playlists'
        const members = 'http://127.0.0.1:8081/api/members'

        const memberId = interaction.member.user.id;

        switch (interaction.options.getSubcommand()) {
            case 'ajouter':
                // Check if user is in db
                await axios.get(`${members}/${memberId}`).catch(async error => {
                    const errorMessage = error.response.data.message;

                    if (errorMessage && errorMessage.includes('NoContentFoundException')) {
                        const newUser = {
                            id: memberId,
                            tag: interaction.member.user.tag
                        }

                        await axios.post(members, newUser)
                            .catch(error => console.log(error));
                    }
                });

                const url = interaction.options.getString('url');
                const name = interaction.options.getString('nom');

                const newPlaylist = {
                    name: name ? name : "Ma playlist",
                    url: url
                }

                await axios.post(playlists, newPlaylist, { params: { memberId } })
                    .catch(error => console.log(error));

                await interaction.editReply('Playlist ajouté !');
                break;

            case 'jouer':
                const queue = await checkPlayerUsable(interaction, client);
                if (!queue) return;

                await axios.get(`${members}/${memberId}/playlists`).then(async response => {
                    const userPlaylists = response.data?._embedded?.playlistDtoList;
                    if (!userPlaylists) await interaction.editReply('Tu n\'as pas de playlist enregistrées !');

                    let buttons = [];
                    for (let i = 0; i < userPlaylists.length; i++) {
                        buttons.push(
                            new ButtonBuilder()
                                .setCustomId('' + userPlaylists[i].id)
                                .setLabel(userPlaylists[i].name)
                                .setStyle(ButtonStyle.Primary)
                        );
                    }
                    const row = new ActionRowBuilder().addComponents(...buttons);
                    const message = await interaction.editReply({ content: 'Playlists(s) :', components: [row] });

                    const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });
                    collector.on('collect', async interaction => {
                        const playlist = userPlaylists.find(playlist => playlist.id == interaction.customId);
                        const result = await client.player.search(playlist.url, {
                            requestedBy: interaction.user,
                            searchEngine: QueryType.AUTO
                        });

                        queue.addTracks(result.tracks);
                        if (!queue.playing) await queue.play();
                        await interaction.update(`Je joue la playlist : **${playlist.name}**`);
                    });
                    collector.on('end', collected => interaction.deleteReply());
                }).catch(async error => {
                    await interaction.editReply('Tu n\'as pas de playlist enregistrées !');
                    console.log(error);
                });
                break;
        }
    },
};

/*
const track = new Track(client.player, {
    title: 'super titre',
    description: 'super petite description ça',
    author: 'moi askip',
    url: 'https://www.youtube.com/watch?v=LOOnXFNJxdI',
    thumbnail: 'https://i3.ytimg.com/vi/LOOnXFNJxdI/maxresdefault.jpg',
    duration: '10',
    views: 1000,
    requestedBy: interaction.member.user,
    source: "youtube"
});

queue.addTrack(track);
await interaction.editReply('Ajouté : ' + track.title);

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