const { SlashCommandBuilder } = require('discord.js');
const notube = require('../../functions/ytConverters/notube');
const cnvmp3 = require('../../functions/ytConverters/cnvmp3');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yt')
        .setDescription('Télécharge et joue une musique youtube')
        .addSubcommand(subcommand => subcommand.setName('notube')
            .setDescription('Joue !'))
        .addSubcommand(subcommand => subcommand.setName('cnvmp3')
            .setDescription('Joue !')),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == 'notube') await notube(client, interaction);
        else if (subcommand == 'cnvmp3') await cnvmp3(client, interaction);
    },
};
