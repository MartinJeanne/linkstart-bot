const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

/** Get user by Discord id */
module.exports = async function (user, name, url) {
    const playlistsUrl = `${process.env.API_URL}/playlists`;

    const newPlaylist = {
        name: name ? name : "Ma playlist",
        url: url
    }

    const discordUserId = user.id;
    const createdPlaylist = await axios.post(playlistsUrl, newPlaylist, { params: { discordUserId } })
        .then(response => {
            return response.data;
        })
        .catch(error => console.log(error));

    return createdPlaylist;
};