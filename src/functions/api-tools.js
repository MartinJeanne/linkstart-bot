require('dotenv').config();

const API_URL = process.env.API_URL + '/';
const CLIENT_NAME = process.env.CLIENT_NAME;
const CLIENT_PASSWORD = process.env.CLIENT_PASSWORD;

let jwt;

async function authenticateAndRedo(failedEndpoint, failedFetchOption) {
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

    await fetch(API_URL + 'auth/login', options)
        .then(async response => await response.json())
        .then(data => jwt = data.token)
        .catch(console.error);

    //re-doing failed request
    failedFetchOption.headers.Authorization = `Bearer ${jwt}`;
    return await fetch(API_URL + failedEndpoint, failedFetchOption).catch(console.error);
}

exports.guilds = 'guilds';
exports.members = 'members';
exports.playlists = 'playlists';
exports.messages = 'messages';
exports.roleReactions = 'roleReactions';

exports.get = async function (endpoint) {
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            if (response.status == 403)
                response = await authenticateAndRedo(endpoint, options);

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
            'Authorization': `Bearer ${jwt}`,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            if (response.status == 403)
                response = await authenticateAndRedo(endpoint, options);

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
            'Authorization': `Bearer ${jwt}`,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            if (response.status == 403)
                response = await authenticateAndRedo(endpoint, options);

            const data = await response.json();
            return { response, data };
        })
        .catch(console.error);
}

exports.patch = async function (endpoint, body) {
    const options = {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            if (response.status == 403)
                response = await authenticateAndRedo(endpoint, options);

            const data = await response.json();
            return { response, data };
        })
        .catch(console.error);
}

exports.del = async function (endpoint) {
    const options = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        }
    }

    return fetch(API_URL + endpoint, options)
        .then(async response => {
            if (response.status == 403)
                response = await authenticateAndRedo(endpoint, options);

            else if (!response.ok)
                throw new Error('Something went wrong in DELETE for endpoint: ' + endpoint);
        })
        .catch(console.error);
}
