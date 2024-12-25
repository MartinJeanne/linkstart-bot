const fs = require('node:fs');
const { useMainPlayer, QueryType } = require('discord-player');
const { savedMusicsEmbedBuilder } = require('../savedMusicsEmbedBuilder.js');
const { addSongToQueue } = require('../queue/addSongsToQueue.js');
const getQueue = require('../queue/getQueue.js');


module.exports = async function (interaction) {
    const player = useMainPlayer();
    const queue = await getQueue({ interaction: interaction, canCreate: true });
    if (!queue) return;

    let page = 0;
    const files = fs.readdirSync(`music-files`).filter(file => file.endsWith('.mp3'));
    const embed = savedMusicsEmbedBuilder(files, page);

    const collectorFilter = m => m.author.id === interaction.user.id && Number.isInteger(parseInt(m.content));
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
