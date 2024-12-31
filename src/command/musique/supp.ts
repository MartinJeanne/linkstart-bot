import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import getQueue from '../../service/queue/getQueue';
import { NoOptionError } from '../../error/generalError/NoOptionError';


export default {
    data: new SlashCommandBuilder()
        .setName('supp')
        .setDescription('Supprime une musique de la file')
        .addIntegerOption(option => option.setName('position')
            .setDescription('Position de la musique dans la file')
            .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        const queue = await getQueue(interaction, false);
        if (!queue) return;

        const index = interaction.options.getInteger('position');
        if (!index) throw new NoOptionError('position');

        const tracks = queue.tracks.toArray();
        const deletedSong = queue.node.remove(tracks[index - 1]);
        if (!deletedSong) await interaction.editReply(`:interrobang: Aucune musique à cette position\n**/file** pour avoir la liste des musiques`);
        else await interaction.editReply(`:broom: Musique supprimé : **${deletedSong.title}**`);
    }
}
