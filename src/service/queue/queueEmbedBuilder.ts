import { GuildQueue } from 'discord-player';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, ComponentBuilder, AnyComponentBuilder } from 'discord.js';


export function queueEmbedBuilder(queue: GuildQueue, page: number): EmbedBuilder {
    if (!queue.currentTrack) return emptyEmbed();

    const progress = queue.node.getTimestamp();
    if (!progress) return emptyEmbed();

    let queueString = '';
    const tracks = queue.tracks.toArray();
    for (let i = (page * 10); i < (page * 10 + 10); i++) {
        if (i >= queue.getSize()) break;
        queueString += `**${i + 1}.** ${tracks[i].title}\n`;
    }

    const pageNb = Math.ceil(queue.getSize() / 10);

    return new EmbedBuilder()
        .setColor('#3b89c2')
        .setTitle(queue.currentTrack.title)
        .setDescription(`*${progress.current.label} : ${progress.total.label}*\n\n` + queueString)
        .setThumbnail(queue.currentTrack.thumbnail)
        .setTimestamp()
        .setFooter({
            text: `\nPage : ${page + 1}/${pageNb > 0 ? pageNb : 1}`,
            iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128'
        });
};

export function queueRowBuilder(queue: GuildQueue, page: number): ActionRowBuilder<ButtonBuilder> | null{
    if (queue.getSize() < 10) null;

    function pageButtonBuilder(id: string, emoji: string) {
        return new ButtonBuilder()
            .setCustomId(id)
            .setLabel(emoji)
            .setStyle(ButtonStyle.Primary);
    }

    const leftBtn = page <= 0 ? null : pageButtonBuilder('left', '⬅️');
    const rigthBtn = page >= Math.ceil(queue.getSize() / 10) - 1 ? null : pageButtonBuilder('right', '➡️');

    if (leftBtn && rigthBtn) return new ActionRowBuilder({ components: [leftBtn, rigthBtn] });
    else if (rigthBtn) return new ActionRowBuilder({ components: [rigthBtn] });
    else if (leftBtn) return new ActionRowBuilder({ components: [leftBtn] });
    else return null;
};

function emptyEmbed(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor('#3b89c2')
        .setTitle('Aucune musique')
        .setDescription('')
        .setFooter({
            text: `\nPage : 1/1`,
            iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128'
        });
}

/* TODO to implement?
module.exports.qEmbedBuilder = class qEmbedBuilder extends EmbedBuilder {
    constructor() {
        const progress = queue.node.getTimestamp();

        let queueString = '';
        const tracks = queue.tracks.toArray();
        for (let i = (page * 10); i < (page * 10 + 10); i++) {
            if (i >= queue.getSize()) break;
            queueString += `**${i + 1}.** ${tracks[i].title}\n`;
        }
    
        const pageNb = Math.ceil(queue.getSize() / 10);
        
        this.setColor(0xd7667e);
        this.setTitle(`${queue.currentTrack.title}`);
        this.setDescription(`*${progress.currentTrack} : ${progress.end}*\n\n` + queueString);
        this.setThumbnail(queue.currentTrack.thumbnail);
        this.setTimestamp();
        this.setFooter({
                text: `\nPage : ${page + 1}/${pageNb > 0 ? pageNb : 1}` ,
                iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128'
            });
    }

};
*/
