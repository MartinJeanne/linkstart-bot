const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.savedMusicsEmbedBuilder = function (files, page) {
    let embedBody = '';
    for (let i = 0; i < files.length; i++) {
        embedBody += `**${i + 1}.** ${files[i].slice(0, -4)}\n`;
    }

    const pageNb = Math.ceil(files.lenght / 10);

    return new EmbedBuilder()
        .setColor('#3b89c2')
        .setTitle(`Musiques enregistrées`)
        .setDescription(embedBody)
        //.setThumbnail(queue.currentTrack.thumbnail)
        .setTimestamp()
        .setFooter({
            text: `\nPage : ${page + 1}/${pageNb > 0 ? pageNb : 1}`,
            iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128'
        });
};
