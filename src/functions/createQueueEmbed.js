const { EmbedBuilder } = require('discord.js');

module.exports = async function (queue, page) {
    const progressBar = queue.createProgressBar({ queue: false, length: 15, timecodes: true })

    let queueString = '_ _\n';
    for (let i = (page * 10); i < (page * 10 + 10); i++) {
        if (i >= queue.tracks.length) break;
        queueString += `**${i + 1}.** ${queue.tracks[i].title}\n`;
    }

    const embed = new EmbedBuilder()
        .setColor(0xd7667e)
        .setTitle(`${queue.nowPlaying().title}\n${progressBar}`)
        .setDescription(queueString)
        .setThumbnail(queue.nowPlaying().thumbnail)
        .setTimestamp()
        .setFooter({
            text: `\nPage : ${page + 1}/${Math.ceil(queue.tracks.length / 10)}`,
            iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128'
        });

    return embed;
};