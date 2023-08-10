const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const usersUrl = `${process.env.API_URL}/discordUsers`;

module.exports.getUser = async function (interaction) {
    const discordId = interaction.member.user.id;

    const user = await axios.get(usersUrl, discordId)
        .then(async response => {
            if (response.status !== 200) return null;

            const user = response.data[0];
            if (user) return user;

            const newUser = {
                discordId: discordId,
                tag: interaction.member.user.tag
            }

            const createdUser = await axios.post(usersUrl, newUser).catch(error => console.error(error));
            return createdUser.data;

        })
        .catch(error => console.error(error));

    return user;
};

module.exports.getUserPlaylists = async function (user) {
    const userPlaylists = await axios.get(`${usersUrl}/${user.id}/playlists`)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(error => console.error(error));

    return userPlaylists;
};
