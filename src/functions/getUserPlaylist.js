const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async function (user) {
    const usersUrl = `${process.env.API_URL}/discordUsers`;

    const userPlaylists = await axios.get(`${usersUrl}/${user.id}/playlists`)
        .then(response => {
            if (response.status === 200) return response.data._embedded?.playlistDtoList;
        })
        .catch(error => console.error(error));

    return userPlaylists;
}
