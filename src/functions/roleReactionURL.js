const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const roleReactionsUrl = `${process.env.API_URL}/roleReactions`;


module.exports.getDiscordMessages = async function () {
    const roleReactions = await axios.get(roleReactionsUrl)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(error => console.error(error));

    return roleReactions;
};
