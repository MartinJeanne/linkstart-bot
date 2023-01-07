const { SlashCommandBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueryType, Track, Playlist } = require('discord-player');
const { default: axios } = require('axios');
const checkPlayerUsable = require('../../functions/checkPlayerUsable');
const getUser = require('../../functions/getUser');
const getUserPlaylist = require('../../functions/getUserPlaylist');
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
        const subcommand = interaction.options.getSubcommand();
        const maxPlaylists = 5;

        if (subcommand == 'crée') {

            const user = await getUser(interaction);
            if (!user.discordId) return await interaction.editReply(`❌ Il y a eu un problème lors de la récupération de l'utilisateur depuis la base de donnée`);

            const userPlaylists = await getUserPlaylist(user);
            if (Array.isArray(userPlaylists) && userPlaylists.length >= maxPlaylists)
                return await interaction.editReply(`Tu es au maximum de playlists : **${maxPlaylists}**`);

            const playlistName = interaction.options.getString('nom');
            const playlistUrl = interaction.options.getString('url');

            const createdPlaylist = await postPlaylist(user, playlistName, playlistUrl);
            if (!createdPlaylist) return await interaction.editReply(`❌ Il y a eu un problème lors de la création de la playlist dans la base de donnée`);

            await interaction.editReply(`:white_check_mark: Nouvelle playlist : **${createdPlaylist.name}**, ajouté !`);
        }


        else if (subcommand == 'joue') {
            const user = await getUser(interaction);
            if (!user.discordId) return await interaction.editReply(`❌ Il y a eu un problème lors de la récupération de l'utilisateur depuis la base de donnée`);

            const userPlaylists = await getUserPlaylist(user);
            if (!userPlaylists) return await interaction.editReply('Tu n\'as pas de playlist enregistrée !');
            
            let buttons = [];
            for (let i = 0; i < userPlaylists.length; i++) {
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(String(userPlaylists[i].id))
                        .setLabel(userPlaylists[i].name)
                        .setStyle(ButtonStyle.Primary)
                );
            }
            const row = new ActionRowBuilder().addComponents(...buttons);
            const message = await interaction.editReply({ content: 'Quelle playlist veux-tu jouer ?', components: [row] });

            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });
            collector.on('collect', async inter => {
                await inter.deferUpdate();
                const queue = await checkPlayerUsable(inter, client);
                if (!queue) return;

                const playlist = userPlaylists.find(playlist => playlist.id == inter.customId);
                const result = await client.player.search(playlist.url, {
                    requestedBy: inter.user,
                    searchEngine: QueryType.AUTO
                });

                queue.addTracks(result.tracks);
                if (!queue.playing) await queue.play();
                await inter.editReply({ content: `Je joue la playlist : **${playlist.name}**`, components: [] });
            });
            //collector.on('end', collected => interaction.deleteReply());
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