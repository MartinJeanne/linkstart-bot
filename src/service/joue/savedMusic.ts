import fs from 'node:fs';
import getQueue from '../queue/getQueue';
import { useMainPlayer, QueryType } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, Message, TextChannel } from 'discord.js';
import { UnexpectedError } from '../../error/generalError/GeneralError';
import savedMusicsEmbedBuilder from './savedMusicsEmbedBuilder';
import { addSongToQueue } from '../queue/addSongsToQueue';


export default async function (interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const player = useMainPlayer();
    const queue = await getQueue(interaction);
    if (!queue) return new EmbedBuilder();

    let page = 0;
    const files = fs.readdirSync(`music-files`).filter(file => file.endsWith('.mp3'));
    if (files.length === 0) throw new UnexpectedError('y\'a pas de musique frr');
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
}
