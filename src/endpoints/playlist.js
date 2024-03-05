const { playlists, members, get, post, del } = require('../functions/api-tools.js');

exports.getUserPlaylists = async function (user) {
    return get(`${members}/${user.id}/${playlists}`)
        .then(({ response, data }) => {
            if (response.ok) return data;
        });
};

exports.postPlaylist = async function (member, name, url) {
    const newPlaylist = {
        name: name ? name : "Ma playlist",
        url
    };

    const queryParam = `?memberId=${member.id}`;

    return post(playlists + queryParam, newPlaylist)
        .then(({ response, data }) => {
            if (response.ok) return data;
        });
};

exports.deletePlaylist = async function (id) {
    del(`${playlists}/${id}`);
};
