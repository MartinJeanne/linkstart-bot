const { SlashCommandBuilder } = require('discord.js');
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('question')
        .setDescription('Pose moi n\'importe quelle question !')
        .addStringOption(option => option.setName('question')
            .setDescription('Ce que tu veux lui dire')
            .setRequired(true)),

    async execute(interaction, client) {
        await interaction.deferReply(); // make Discord API wait for reply

        const prompt = interaction.options.getString('question');
        // TODO établir un meilleur contexte (faire une recherche), utiliser le pseudo de l'user ?
        const question = `Réponds à cette comme question si tu étais une intelligence artificiel appelé "Linkstart-bot", faisant parti d'un serveur Discord appelé "Linkstart", et que ton créateur s'appellelait "Garwalle", voici la question :\n` + prompt


        const body = JSON.stringify({
            'model': 'text-davinci-003',
            'prompt': question,
            'temperature': 1
        });

        // TODO use .env
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        };

        await axios.post('https://api.openai.com/v1/completions', body, { headers: headers })
            .then(response => {
                const data = response.data.choices[0].text.slice(2);;
                interaction.editReply(`**Question :** ${prompt}\n\n**Réponse :** ${data}`);
            }).catch(function (error) {
                console.log(error);
            });
    },
};