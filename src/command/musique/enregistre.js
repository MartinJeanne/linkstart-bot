const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, QueryType } = require('discord-player');
const getQueue = require('../../service/queue/getQueue');
const { addSongToQueue } = require('../../service/queue/addSongsToQueue.js');
const onlymp3 = require('../../service/ytConverters/onlymp3.js');

// Some yt converters (found onlymp3 on this):
// https://www.movavi.com/fr/learning-portal/meilleur-convertisseur-youtube-mp3.html

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enregistre')
        .setDescription('Télécharge une musique depuis youtube')
        .addStringOption(option => option.setName('lien')
            .setDescription('Lien YT de la musique')
            .setRequired(true))
        .addBooleanOption(option => option.setName('jouer')
            .setDescription('Jouer la musique après son enregistrement ?')
            .setRequired(true)),

    async execute(interaction, client) {
        const link = interaction.options.getString('lien');
        const doPlay = interaction.options.getBoolean('jouer');

        let queue;
        if (doPlay) {
            queue = await getQueue({ interaction: interaction, canCreate: true });
            if (!queue) return;
        }

        const downloadedFileName = await onlymp3(link, interaction);
        if (!downloadedFileName) return;
        if (!doPlay) return await interaction.editReply(`💾 Musique téléchargée avec succès !\nTitre : **${downloadedFileName}**`);

        // Playing the downloaded file
        const player = useMainPlayer();
        const result = await player.search(`./music-files/${downloadedFileName}.mp3`, {
            requestedBy: interaction.user.id,
            searchEngine: QueryType.FILE,
        });

        try {
            const reply = addSongToQueue(result.tracks[0], queue);
            await interaction.editReply('💾 Musique téléchargée avec succès !');
            await interaction.channel.send(reply);
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Erreur lors de la lecture de la musique');
        }
    },
};
