const { SlashCommandBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueryType, Track, Playlist } = require('discord-player');
const getQueue = require('../../functions/getQueue.js');
const { getUser, getUserPlaylists } = require('../../endpoints/discordUser.js');
const { postPlaylist, deletePlaylist } = require('../../endpoints/playlist.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Play or save a playlist!')
        .addSubcommand(subcommand => subcommand.setName('create')
            .setDescription('Save a playlist')
            .addStringOption(option => option.setName('link').setDescription('Link of your playlist').setRequired(true))
            .addStringOption(option => option.setName('name').setDescription('Name of the playlist')))
        .addSubcommand(subcommand => subcommand.setName('play')
            .setDescription('Play your playlist!'))
        .addSubcommand(subcommand => subcommand.setName('remove')
            .setDescription('Delete a playlist')),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const maxPlaylists = 5;

        if (subcommand == 'create') {
            const user = await getUser(interaction);
            if (!user.discordId) return await interaction.editReply(`❌ Il y a eu un problème lors de la récupération de l'utilisateur depuis la base de donnée`);

            const userPlaylists = await getUserPlaylists(user);
            if (Array.isArray(userPlaylists) && userPlaylists.length >= maxPlaylists)
                return await interaction.editReply(`Tu es au maximum de playlists : **${maxPlaylists}**`);

            const playlistName = interaction.options.getString('name');
            const playlistUrl = interaction.options.getString('link');

            const createdPlaylist = await postPlaylist(user, playlistName, playlistUrl);
            if (!createdPlaylist) return await interaction.editReply(`❌ Il y a eu un problème lors de la création de la playlist dans la base de donnée`);

            await interaction.editReply(`:white_check_mark: Nouvelle playlist : **${createdPlaylist.name}**, ajouté !`);
        }


        else if (subcommand == 'play') {
            const user = await getUser(interaction);
            if (!user.discordId) return await interaction.editReply(`❌ Il y a eu un problème lors de la récupération de l'utilisateur depuis la base de donnée`);

            const userPlaylists = await getUserPlaylists(user);
            if (!Array.isArray(userPlaylists)) return await interaction.editReply(`Tu n'as pas de playlist enregistrée`);

            const buttons = [];
            for (let i = 0; i < userPlaylists.length; i++) {
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(String(userPlaylists[i].id))
                        .setLabel(userPlaylists[i].name)
                        .setStyle(ButtonStyle.Primary)
                );
            }
            const row = new ActionRowBuilder().addComponents(...buttons);
            const message = await interaction.editReply({ content: 'Wich playlist you wanna play?', components: [row] });

            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });
            collector.on('collect', async inter => {
                await inter.deferUpdate();
                const queue = await getQueue({interaction: interaction, client: client, canCreate: true});
                if (!queue) return;

                const playlist = userPlaylists.find(playlist => playlist.id == inter.customId);
                const result = await client.player.search(playlist.url, {
                    requestedBy: inter.user,
                    searchEngine: QueryType.AUTO
                });

                queue.addTrack(result.tracks);
                if (!queue.isPlaying()) await queue.node.play();
                await inter.editReply({ content: `▶️ Je joue ta playlist : **${playlist.name}**`, components: [] });
                collector.stop();
            });
        }


        else if (subcommand == 'remove') {
            const user = await getUser(interaction);
            if (!user.discordId) return await interaction.editReply(`❌ Il y a eu un problème lors de la récupération de l'utilisateur depuis la base de donnée`);

            const userPlaylists = await getUserPlaylists(user);
            if (!Array.isArray(userPlaylists)) return await interaction.editReply(`:interrobang: Tu n'as pas de playlist enregistrée`);

            const buttons = [];
            for (let i = 0; i < userPlaylists.length; i++) {
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(String(userPlaylists[i].id))
                        .setLabel(userPlaylists[i].name)
                        .setStyle(ButtonStyle.Primary)
                );
            }
            const row = new ActionRowBuilder().addComponents(...buttons);
            const message = await interaction.editReply({ content: 'Quelle playlist veux-tu supprimer ?', components: [row] });

            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });
            collector.on('collect', async inter => {
                const playlist = userPlaylists.find(playlist => playlist.id == inter.customId);

                deletePlaylist(playlist.id);
                await inter.reply({ content: `:wastebasket: Playlist supprimé : **${playlist.name}**`, components: [] });
                collector.stop();
            });
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