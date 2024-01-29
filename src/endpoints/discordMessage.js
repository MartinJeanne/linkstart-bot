const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const discordMessagesUrl = `${process.env.API_URL}/discordMessages`;

module.exports.getDiscordMessages = async function () {
    return axios.get(discordMessagesUrl)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(console.error);
};
