require('dotenv').config();

const API_URL = process.env.API_URL + '/';

exports.guilds = 'guilds';
exports.members = 'members';
exports.playlists = 'playlists';
exports.messages = 'messages';
exports.roleReactions = 'roleReactions';

exports.get = async function (endpoint) {
    return fetch(API_URL + endpoint)
        .then(async response => {
            const data = await response.json();
            return { response, data };
        })
        .catch(console.error);
}

exports.post = async function (endpoint, body) {
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            const data = await response.json();
            return { response, data };
        })
        .catch(console.error);
}

exports.put = async function (endpoint, body) {
    const options = {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            const data = await response.json();
            return { response, data };
        })
        .catch(console.error);
}

exports.del = async function (endpoint) {
    const options = {
        method: 'DELETE'
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            if (!response.ok)
                throw new Error('Something went wrong in DELETE for endpoint: ' + endpoint);
        })
        .catch(console.error);
}
