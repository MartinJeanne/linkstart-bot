import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import getQueue from '../../service/queue/getQueue';
import { ClientEx } from '../../model/Client';
import { NoOptionError } from '../../error/NoOptionError';


export default {
    data: new SlashCommandBuilder()
        .setName('déplace')
        .setDescription('Déplace une musique à une certaine position')
        .addIntegerOption(option =>
            option.setName('musique')
                .setDescription('Position actuelle de la musique à déplacer')
                .setMinValue(1)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Position de où la déplacer')
                .setMinValue(1)
                .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction, client: ClientEx) {
        const queue = await getQueue(interaction,  false);
        if (!queue) return;

        let index = interaction.options.getInteger('musique');
        let position = interaction.options.getInteger('position');
        if (!index || !position) throw new NoOptionError('musique or position');
        index--;
        position--;

        if (index > queue.getSize() - 1 || position > queue.getSize() - 1)
            return await interaction.editReply(`:interrobang: Musique ou position invalide, nombre de musique dans la file : **${queue.getSize()}**`);
        else if (position === index)
            return await interaction.editReply(`:interrobang: La position actuelle et future de la musique ne peuvent pas être les mêmes :sparkles:`);

        const track = queue.tracks.toArray()[index];

        queue.removeTrack(track);
        queue.insertTrack(track, position);

        await interaction.editReply(':arrow_heading_down: Musique déplacé !');
    }
}
