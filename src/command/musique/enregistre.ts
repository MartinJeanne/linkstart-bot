import { ChatInputCommandInteraction, SlashCommandBuilder, TextBasedChannel, TextChannel } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player';
import getQueue from '../../service/queue/getQueue';
import { addSongToQueue } from '../../service/queue/addSongsToQueue';
import { ClientEx } from '../../model/Client';
import onlymp3 from '../../service/ytConverters/onlymp3';
import { NoOptionError } from '../../error/NoOptionError';

// Some yt converters (found onlymp3 on this):
// https://www.movavi.com/fr/learning-portal/meilleur-convertisseur-youtube-mp3.html

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

    async execute(interaction: ChatInputCommandInteraction, client: ClientEx) {
        const link = interaction.options.getString('lien');
        const doPlay = interaction.options.getBoolean('jouer');
        if (!link) throw new NoOptionError('lien');

        const downloadedFileName = await onlymp3(link, interaction);
        if (!downloadedFileName) return await interaction.editReply('❌ Erreur lors du téléchargement de la musique');
        if (!doPlay) return await interaction.editReply(`💾 Musique téléchargée avec succès !\nTitre : **${downloadedFileName}**`);

        const queue = await getQueue(interaction);
        if (!queue) return;

        // Playing the downloaded file
        const player = useMainPlayer();
        const result = await player.search(`./music-files/${downloadedFileName}.mp3`, {
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
