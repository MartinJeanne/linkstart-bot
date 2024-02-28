const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const playlistsUrl = `${process.env.API_URL}/playlists`;

/** Get user by Discord id */
module.exports.postPlaylist = async function (member, name, url) {
    const newPlaylist = {
        name: name ? name : "Ma playlist",
        url: url
    };

    const memberId = member.id;
    return axios.post(playlistsUrl, newPlaylist, { params: { memberId } })
        .then(response => {
            return response.data;
        })
        .catch(error => console.log(error));
};

module.exports.deletePlaylist = async function (id) {
    axios.delete(`${playlistsUrl}/${id}`)
        .catch(error => console.log(error));
};
