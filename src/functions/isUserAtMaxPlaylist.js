const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async function (user, maxPlaylists) {
    const usersUrl = `${process.env.API_URL}/discordUsers`;

    const isMaxPlaylists = await axios.get(`${usersUrl}/${user.id}/playlists`)
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                const userPlaylists = response.data._embedded?.playlistDtoList;
                if (userPlaylists.length < maxPlaylists) return false;
                else return true;
            }
        })
        .catch(error => console.error(error));

    return isMaxPlaylists;
}