const { SlashCommandBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Joue ou sauvegarde une playlist !')
        .addSubcommand(subcommand => subcommand.setName('test')
            .setDescription('Joue à un quiz !')
            .addStringOption(option => option.setName('url').setDescription('Le lien de la playlist').setRequired(true))
            .addStringOption(option => option.setName('nom').setDescription('Nom de la playlist')))
        .addSubcommand(subcommand => subcommand.setName('manage')
            .setDescription('Crée ou modifie tes propres quiz')),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const maxPlaylists = 5;

        if (subcommand == 'manage') {

        }
    }
}
