const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const usersUrl = `${process.env.API_URL}/discordUsers`;

module.exports.getUser = async function (discordUser) {
    const user = await axios.get(`${usersUrl}/${discordUser.id}`)
        .then(async response => {
            if (response.status === 200 && response.data) return response.data;

            const newUser = {
                discordId: discordUser.id,
                avatarURL: discordUser.avatarURL(),
                tag: discordUser.tag
            }

            const createdUser = await axios.post(usersUrl, newUser).catch(error => console.error(error));
            return createdUser.data;

        })
        .catch(error => console.error(error));

    return user;
};

module.exports.getUserPlaylists = async function (user) {
    const userPlaylists = await axios.get(`${usersUrl}/${user.discordId}/playlists`)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(error => console.error(error));

    return userPlaylists;
};
