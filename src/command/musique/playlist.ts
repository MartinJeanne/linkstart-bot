import { SlashCommandBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { useMainPlayer, QueryType, Track, Playlist } from 'discord-player';
import getQueue from '../../service/queue/getQueue';
import { getUserPlaylists, postPlaylist, deletePlaylist } from '../../service/endpoints/playlist';
import { getOrCreateMember } from '../../service/endpoints/members';
import { NoOptionError } from '../../error/generalError/OptionError';
import { addSongToQueue, addPlaylistToQueue } from '../../service/queue/addSongsToQueue';
import { NoMemberError } from '../../error/generalError/MemberError';


export default {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Joue ou sauvegarde une playlist !')
        .addSubcommand(subcommand => subcommand.setName('crée')
            .setDescription('Ajoute une playlist existante')
            .addStringOption(option => option.setName('url').setDescription('Le lien de la playlist').setRequired(true))
            .addStringOption(option => option.setName('nom').setDescription('Nom de la playlist')))
        .addSubcommand(subcommand => subcommand.setName('joue')
            .setDescription('Joue une playlist !'))
        .addSubcommand(subcommand => subcommand.setName('supp')
            .setDescription('Supprime une playlist')),

    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const subcommand = interaction.options.getSubcommand();
        const maxPlaylists = 5;

        /** Create member in DB if not exist */
        if (!(interaction.member instanceof GuildMember)) throw new NoMemberError();
        const member = await getOrCreateMember(interaction.member);
        if (!member) return await interaction.editReply(`❌ Il y a eu un problème lors de la récupération de l'utilisateur depuis la base de donnée`);


        if (subcommand == 'crée') {

            const userPlaylists = await getUserPlaylists(member);
            if (Array.isArray(userPlaylists) && userPlaylists.length >= maxPlaylists)
                return await interaction.editReply(`Tu es au maximum de playlists : **${maxPlaylists}**`);

            const playlistName = interaction.options.getString('nom');
            const playlistUrl = interaction.options.getString('url');
            if (!playlistName) throw new NoOptionError('nom');
            if (!playlistUrl) throw new NoOptionError('url');

            const createdPlaylist = await postPlaylist(member, playlistName, playlistUrl);
            if (!createdPlaylist) return await interaction.editReply(`❌ Il y a eu un problème lors de la création de la playlist dans la base de donnée`);

            await interaction.editReply(`:white_check_mark: Playlist crée : **${createdPlaylist.name}**`);
        }


        else if (subcommand == 'joue') {

            const userPlaylists = await getUserPlaylists(member);
            if (!Array.isArray(userPlaylists) || userPlaylists.length === 0)
                return await interaction.editReply(`:interrobang: Tu n'as pas de playlist enregistrée`);

            const buttons: Array<ButtonBuilder> = [];
            for (let i = 0; i < userPlaylists.length; i++) {
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(String(userPlaylists[i].id))
                        .setLabel(userPlaylists[i].name)
                        .setStyle(ButtonStyle.Primary)
                );
            }
            const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder({ components: buttons });
            const message = await interaction.editReply({ content: 'Quelle playlist veux-tu jouer ?', components: [row] });

            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });
            collector.on('collect', async inter => {
                await inter.deferUpdate();
                const queue = await getQueue(interaction, true);

                const playlist = userPlaylists.find(playlist => playlist.id == inter.customId);
                if (!playlist) return await inter.editReply(`❌ Il y a eu un problème lors de la récupération de ta playlist`);


                const result = await player.search(playlist.url, {
                    requestedBy: inter.user,
                    searchEngine: QueryType.AUTO
                });

                let reply: string;
                if (result.playlist) reply = addPlaylistToQueue(result.tracks, result.playlist, queue);
                else reply = addSongToQueue(result.tracks[0], queue);
                await inter.editReply(reply);
                collector.stop();
            });
        }


        else if (subcommand == 'supp') {

            const userPlaylists = await getUserPlaylists(member);
            if (!Array.isArray(userPlaylists)) return await interaction.editReply(`:interrobang: Tu n'as pas de playlist enregistrée`);

            const buttons: Array<ButtonBuilder> = [];
            for (let i = 0; i < userPlaylists.length; i++) {
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(String(userPlaylists[i].id))
                        .setLabel(userPlaylists[i].name)
                        .setStyle(ButtonStyle.Primary)
                );
            }
            const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder({ components: [...buttons] });
            const message = await interaction.editReply({ content: 'Quelle playlist veux-tu supprimer ?', components: [row] });

            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });
            collector.on('collect', async inter => {
                const playlist = userPlaylists.find(playlist => playlist.id == inter.customId);

                deletePlaylist(playlist.id);
                await inter.reply({ content: `:wastebasket: Playlist supprimé : **${playlist.name}**`, components: [] });
                collector.stop();
            });
        }
    }
}

/*
const track = new Track(player, {
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

const playlist = new Playlist(player, {
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