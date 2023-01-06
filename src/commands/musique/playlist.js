const { SlashCommandBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueryType, Track, Playlist } = require('discord-player');
const { default: axios } = require('axios');
const checkPlayerUsable = require('../../functions/checkPlayerUsable.js');
const getUser = require('../../functions/getUser');
const isUserAtMaxPlaylist = require('../../functions/isUserAtMaxPlaylist');
const postPlaylist = require('../../functions/postPlaylist');
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
        const membersUrl = `${process.env.API_URL}/discordUsers`;

        const discordId = interaction.member.user.id;
        const maxPlaylists = 5;

        switch (interaction.options.getSubcommand()) {
            case 'crée':
                const user = await getUser(interaction);
                if (!user.discordId) return await interaction.editReply(`❌ Il y a eu un problème lors de la récupération de l'utilisateur depuis la base de donnée`);

                const isMaxPlaylist = await isUserAtMaxPlaylist(user, maxPlaylists);
                if (isMaxPlaylist === true) return await interaction.editReply(`Tu es au maximum de playlists : ${maxPlaylists}`);

                const playlistName = interaction.options.getString('nom');
                const playlistUrl = interaction.options.getString('url');
                
                const createdPlaylist = await postPlaylist(user, playlistName, playlistUrl);
                if (!createdPlaylist) return await interaction.editReply(`❌ Il y a eu un problème lors de la création de la playlist dans la base de donnée`);

                await interaction.editReply(`✔️ Nouvelle playlist : ${createdPlaylist.name} ajouté !`);
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