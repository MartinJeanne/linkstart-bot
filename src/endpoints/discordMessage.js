const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const discordMessagesUrl = `${process.env.API_URL}/discordMessages`;

module.exports.getDiscordMessages = async function () {
    try {
        const discordMessages = await axios.get(discordMessagesUrl)
            .then(response => {
                if (response.status === 200) return response.data;
            })
            .catch(error => console.error(error));

        return discordMessages;
    } catch (error) {
        console.log(error);
    }
};
