const { SlashCommandBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueryType, Track, Playlist } = require('discord-player');
const { default: axios } = require('axios');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Joue ou sauvegarde une playlist !')
        .addSubcommand(subcommand => subcommand.setName('crée')
            .setDescription('Ajoute une playlist existante')
            .addStringOption(option => option.setName('url').setDescription('Le lien de la playlist')
                .setRequired(true))
            .addStringOption(option => option.setName('nom').setDescription('Nom de la playlist')))
        .addSubcommand(subcommand => subcommand.setName('joue')
            .setDescription('Joue une playlist !')),

    async execute(interaction, client) {
        const playlistsUrl = `${process.env.API_URL}/playlists`;
        const membersUrl = `${process.env.API_URL}/members`;

        const discordId = interaction.member.user.id;
        const maxPlaylists = 5;

        // TODO don't throw error in linkstart-backend when no content
        switch (interaction.options.getSubcommand()) {
            case 'crée':
                const userId = await axios.get(membersUrl, discordId).then(async response => {
                    if (response.status === 200) return response.data._embedded.memberDtoList[0].id;
                    else if (response.status === 204) {
                        const newUser = {
                            discordId: discordId,
                            tag: interaction.member.user.tag
                        }

                        const res = await axios.post(membersUrl, newUser).catch(error => console.error(error));
                        return res.data.id;
                    }
                    else return null;
                }).catch(error => console.error(error));

                if (!userId) return await interaction.editReply(`❌ Il y a eu un problème lors de la récupération de l'utilisateur`);

                const isMaxPlaylists = await axios.get(`${membersUrl}/${userId}/playlists`).then(response => {
                    const userPlaylists = response.data._embedded.playlistDtoList;
                    if (response.status === 204) return false;
                    else if (response.status === 200 && userPlaylists?.length < maxPlaylists) return false;
                    else return true;
                }).catch(error => console.error(error));

                if (isMaxPlaylists === true) return await interaction.editReply(`Tu es au maximum de playlists : ${maxPlaylists}`);

                const name = interaction.options.getString('nom');
                const url = interaction.options.getString('url');

                const newPlaylist = {
                    name: name ? name : "Ma playlist",
                    url: url
                }

                await axios.post(playlistsUrl, newPlaylist, { params: { discordId } })
                    .catch(error => console.log(error));

                await interaction.editReply('Playlist ajouté !');
                break;

            case 'joue':
                const queue = await checkPlayerUsable(interaction, client);
                if (!queue) return;

                await axios.get(`${membersUrl}/${discordId}/playlists`).then(async response => {
                    const userPlaylists = response.data?._embedded?.playlistDtoList;
                    if (!userPlaylists) await interaction.editReply('Tu n\'as pas de playlist enregistrée !');

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
                })/*.catch(async error => {
                    await interaction.editReply('Tu n\'as pas de playlist enregistrées !');
                    console.log(error);
                });*/
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