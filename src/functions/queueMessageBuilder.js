const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports.queueEmbedBuilder = async function (queue, page) {
    const progress = queue.node.getTimestamp();

    let queueString = '';
    const tracks = queue.tracks.toArray();
    for (let i = (page * 10); i < (page * 10 + 10); i++) {
        if (i >= queue.getSize()) break;
        queueString += `**${i + 1}.** ${tracks[i].title}\n`;
    }

    const pageNb = Math.ceil(queue.tracks.length / 10);
    
    return new EmbedBuilder()
        .setColor(0xd7667e)
        .setTitle(`${queue.currentTrack.title}`)
        .setDescription(`*${progress.currentTrack} : ${progress.end}*\n\n` + queueString)
        .setThumbnail(queue.currentTrack.thumbnail)
        .setTimestamp()
        .setFooter({
            text: `\nPage : ${page + 1}/${pageNb > 0 ? pageNb : 1}` ,
            iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128'
        });
};

module.exports.queueRowBuilder = async function (queue, page) {
    if (queue.tracks.length < 10) return null;

    function pageButtonBuilder(id, emoji) {
        return new ButtonBuilder()
            .setCustomId(id)
            .setLabel(emoji)
            .setStyle(ButtonStyle.Primary);
    }

    const leftBtn = page <= 0 ? null : pageButtonBuilder('left', '⬅️');
    const rigthBtn = page >= Math.ceil(queue.tracks.length / 10) - 1 ? null : pageButtonBuilder('right', '➡️');

    if (leftBtn && rigthBtn) return new ActionRowBuilder().addComponents(leftBtn, rigthBtn);
    else if (rigthBtn) return new ActionRowBuilder().addComponents(rigthBtn);
    else if (leftBtn) return new ActionRowBuilder().addComponents(leftBtn);
};
