const { SlashCommandBuilder } = require('discord.js');
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ia')
        .setDescription('Pose une question à l\'IA')
        .addStringOption(option => option.setName('question')
            .setDescription('Ce que tu veux lui dire')
            .setRequired(true)),

    async execute(interaction, client) {
        await interaction.deferReply(); // make Discord API wait for reply

        const prompt = interaction.options.getString('question');

        const body = JSON.stringify({
            'model': 'text-davinci-003',
            'prompt': prompt,
            'max_tokens': 4000,
            'temperature': 1
        });

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        };

        await axios.post('https://api.openai.com/v1/completions', body, { headers: headers })
            .then(response => {
                //console.log(response.data);
                const data = response.data.choices[0].text.slice(2);;
                interaction.editReply(`**Prompt :** ${prompt}\n\n**Réponse :** ${data}`);
            }).catch(function (error) {
                console.log(error);
            });
    },
};