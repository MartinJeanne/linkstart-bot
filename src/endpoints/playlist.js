const { default: axios } = require('axios');
const { playlistsUrl, playlists, membersUrl } = require('../functions/endpointsUrl.js');

exports.getUserPlaylists = async function (user) {
    return axios.get(`${membersUrl}/${user.id}/${playlists}`)
        .then(response => {
            if (response.status === 200) 
                return response.data;
        })
        .catch(console.error);
};

exports.postPlaylist = async function (member, name, url) {
    const newPlaylist = {
        name: name ? name : "Ma playlist",
        url: url
    };

    const memberId = member.id;
    return axios.post(playlistsUrl, newPlaylist, { params: { memberId } })
        .then(response => {
            return response.data;
        })
        .catch(console.error);
};

exports.deletePlaylist = async function (id) {
    axios.delete(`${playlistsUrl}/${id}`)
        .catch(console.error);
};
