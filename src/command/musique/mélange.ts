import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import getQueue from '../../service/queue/getQueue';


export default {
    data: new SlashCommandBuilder()
        .setName('mélange')
        .setDescription('Mélange les musiques'),

    async execute(interaction: ChatInputCommandInteraction) {
        const queue = await getQueue(interaction, false);

        if (queue.getSize() < 2) return await interaction.editReply(`:interrobang: Pas assez de musique pour mélanger la file`);
        queue.tracks.shuffle();
        await interaction.editReply(`:twisted_rightwards_arrows: File mélangé !`);
    }
}
