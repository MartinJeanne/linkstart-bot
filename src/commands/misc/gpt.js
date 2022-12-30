const { ChatGPTAPIBrowser } = require('chatgpt'); // TODO that's the thing that don't work!
const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gpt')
        .setDescription('Pose une question à GPT')
        .addStringOption(option => option.setName('question')
            .setDescription('Ce que tu veux lui dire')
            .setRequired(true)),

    async execute(interaction, client) {
        await interaction.deferReply();

        const prompt = interaction.options.getString('question');

        const api = new ChatGPTAPIBrowser({
            email: process.env.OPENAI_EMAIL,
            password: process.env.OPENAI_PASSWORD
        })
        await api.initSession()

        const result = await api.sendMessage('Hello World!')

        await interaction.editReply(`**Prompt :** ${prompt}\n\n**Réponse :** ${result.response}`);
    },
};