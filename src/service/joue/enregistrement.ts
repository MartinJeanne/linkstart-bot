import fs from 'node:fs';
import getQueue from '../queue/getQueue';
import { useMainPlayer, QueryType } from 'discord-player';
import { ChatInputCommandInteraction, Message, TextChannel } from 'discord.js';
import { UnexpectedError } from '../../error/UnexpectedError';
const { savedMusicsEmbedBuilder } = require('../savedMusicsEmbedBuilder');
const { addSongToQueue } = require('../queue/addSongsToQueue');


export default async function (interaction: ChatInputCommandInteraction) {
    const player = useMainPlayer();
    const queue = await getQueue(interaction);
    if (!queue) return;

    let page = 0;
    const files = fs.readdirSync(`music-files`).filter(file => file.endsWith('.mp3'));
    const embed = savedMusicsEmbedBuilder(files, page);

    const collectorFilter = (m: Message) =>
        m.author.id === interaction.user.id && Number.isInteger(parseInt(m.content));

    if (!interaction.channel || !(interaction.channel instanceof TextChannel))
        throw new UnexpectedError('no channel or not a text channel');
    const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 30_000 });

    collector.on('collect', async m => {
        const i = parseInt(m.content) - 1; // Song index

        const result = await player.search(`music-files/${files[i]}`, {
            requestedBy: m.author,
            searchEngine: QueryType.FILE,
        });

        try {
            const reply = addSongToQueue(result.tracks[0], queue);
            await m.reply(reply);
        } catch (error) {
            console.error(error);
            await m.reply('❌ Erreur lors de la lecture de la musique');
        }
    });

    collector.on('end', async collected => {
        interaction.deleteReply();
    });

    return embed;
};
