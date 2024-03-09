require('dotenv').config();

const API_URL = process.env.API_URL + '/';
const CLIENT_NAME = process.env.CLIENT_NAME;
const CLIENT_PASSWORD = process.env.CLIENT_PASSWORD;

let token;

exports.guilds = 'guilds';
exports.members = 'members';
exports.playlists = 'playlists';
exports.messages = 'messages';
exports.roleReactions = 'roleReactions';

async function authenticate() {
    const body = {
        clientName: CLIENT_NAME,
        password: CLIENT_PASSWORD
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    return fetch(API_URL + 'auth/login', options)
        .then(async response => await response.json())
        .then(data => token = data.token)
        .catch(console.error);
}

exports.get = async function (endpoint) {
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            if (response.status == 403) {
                await authenticate();
                return await exports.get(endpoint);
            }
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
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            if (response.status == 403) {
                await authenticate();
                return await exports.post(endpoint, body);
            }
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
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            if (response.status == 403) {
                await authenticate();
                return await exports.put(endpoint, body);
            }
            const data = await response.json();
            return { response, data };
        })
        .catch(console.error);
}

exports.del = async function (endpoint) {
    const options = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            if (response.status == 403) {
                await authenticate();
                return await exports.del(endpoint);
            }
            else if (!response.ok)
                throw new Error('Something went wrong in DELETE for endpoint: ' + endpoint);
        })
        .catch(console.error);
}
