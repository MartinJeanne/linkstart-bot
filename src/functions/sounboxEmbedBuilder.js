const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.soundboxEmbedBuilder = function (files, page) {
    let embedBody = '';
    for (let i = (page * 10); i < (page * 10 + 10); i++) {
        if (i >= files.length) break;
        embedBody += `**${i + 1}.** ${files[i].slice(0, -4)}\n`;
    }

    const pageNb = Math.ceil(files.lenght / 10);

    return new EmbedBuilder()
        .setColor('#3b89c2')
        .setTitle(`Soundbox`)
        .setDescription(embedBody)
        //.setThumbnail(queue.currentTrack.thumbnail)
        .setTimestamp()
        .setFooter({
            text: `\nPage : ${page + 1}/${pageNb > 0 ? pageNb : 1}`,
            iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128'
        });
};

exports.soundboxRowBuilder = function (files, page) {
    const buttons = [];
    function pageButtonBuilder(number) {
        return new ButtonBuilder()
            .setCustomId(number.toString())
            .setLabel(number.toString())
            .setStyle(ButtonStyle.Primary);
    }

    for (let i = (page * 10); i < (page * 10 + 10); i++) {
        if (i >= files.length) break;
        const newBtn = pageButtonBuilder(i + 1);
        buttons.push(newBtn);
    }

    return new ActionRowBuilder().addComponents(...buttons);
};

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
