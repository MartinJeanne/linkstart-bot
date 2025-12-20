import {ChatInputCommandInteraction, SlashCommandBuilder, TextBasedChannel, TextChannel} from 'discord.js';
import {useMainPlayer, QueryType} from 'discord-player';
import getQueue from '../../service/queue/getQueue';
import {addSongToQueue} from '../../service/queue/addSongsToQueue';
import {NoOptionError} from '../../error/generalError/OptionError';
import ytDlp from "../../service/ytConverters/yt-dlp";

export default {
    data: new SlashCommandBuilder()
        .setName('enregistre')
        .setDescription('Télécharge une musique depuis youtube')
        .addStringOption(option => option.setName('lien')
            .setDescription('Lien YT de la musique')
            .setRequired(true))
        .addBooleanOption(option => option.setName('jouer')
            .setDescription('Jouer la musique après son enregistrement ?')
            .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        const link = interaction.options.getString('lien');
        const doPlay = interaction.options.getBoolean('jouer');
        if (!link) throw new NoOptionError('lien');
        if (!doPlay) throw new NoOptionError('jouer');

        const downloadedFileName = await ytDlp(link, doPlay);
        if (!doPlay) return await interaction.editReply(`💾 Musique téléchargée avec succès !\nTitre : **${downloadedFileName}**`);

        const queue = await getQueue(interaction);

        // Playing the downloaded file
        console.log(downloadedFileName);
        const player = useMainPlayer();
        const result = await player.search(`./music-files/${downloadedFileName}`, {
            requestedBy: interaction.user.id,
            searchEngine: QueryType.FILE,
        });

        try {
            const reply = addSongToQueue(result.tracks[0], queue);
            await interaction.editReply('💾 Musique téléchargée avec succès !');
            const channel = interaction.channel as TextChannel;
            await channel.send(reply);
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Erreur lors de la lecture de la musique');
        }
    }
}
