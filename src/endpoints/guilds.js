const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const guildsUrl = `${process.env.API_URL}/guilds`;

module.exports.getGuilds = async function () {
    return axios.get(guildsUrl)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(console.error);
};

module.exports.getGuild = async function (id) {
    return axios.get(`${guildsUrl}/${id}`)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(console.error);
};

module.exports.postGuilds = async function (guild) {
    const newGuild = { id: guild.id, name: guild.name };

    return axios.post(guildsUrl, newGuild)
        .then(response => {
            if (response.status === 201) return response.data;
        })
        .catch(console.error);
};
