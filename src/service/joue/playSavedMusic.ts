import fs from 'node:fs';
import getQueue from '../queue/getQueue';
import { useMainPlayer, QueryType } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, Message, TextChannel } from 'discord.js';
import savedMusicsEmbedBuilder from './savedMusicsEmbedBuilder';
import { addSongToQueue } from '../queue/addSongsToQueue';
import { NoChannelError } from '../../error/generalError/ChannelError';
import { NoData } from '../../error/botMisuseError/NoData';
import BotMisuseError from '../../error/botMisuseError/BotMisuseError';


export default async function (interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const player = useMainPlayer();

    let page = 0;
    const files = fs.readdirSync(`music-files`).filter(file => file.endsWith('.mp3'));
    if (files.length === 0) throw new NoData('Aucune musique enregistrée');
    const embed = savedMusicsEmbedBuilder(files, page);

    const collectorFilter = (m: Message) =>
        m.author.id === interaction.user.id && Number.isInteger(parseInt(m.content));

    if (!interaction.channel || !(interaction.channel instanceof TextChannel)) throw new NoChannelError();
    const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 30_000 });

    collector.on('collect', async m => {
        try {
            const i = Number(m.content) - 1; // Song index
            console.log(i);
            
            if (!i || i < 0 || i >= files.length)
                return await m.reply(':interrobang: identifiant invalide');

            const result = await player.search(`music-files/${files[i]}`, {
                requestedBy: m.author,
                searchEngine: QueryType.FILE,
            });

            const queue = await getQueue(interaction);
            const reply = addSongToQueue(result.tracks[0], queue);
            await m.reply(reply);
        } catch (error) {
            if (error instanceof BotMisuseError) {
                await m.reply(error.message);
            } else {
                console.error(error);
                await m.reply('❌ Erreur lors de la lecture de la musique');
            }
        }
    });

    collector.on('end', async collected => {
        interaction.deleteReply();
    });

    return embed;
}
