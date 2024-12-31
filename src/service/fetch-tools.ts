import { DeleteError, FetchAfterAuthError } from "../error/FetchError";
import fetchOptions from "../model/FetchOption";


const API_URL = process.env.API_URL + '/';
const CLIENT_NAME = process.env.CLIENT_NAME;
const CLIENT_PASSWORD = process.env.CLIENT_PASSWORD;

let jwt: string;

async function authenticateAndRedo(failedEndpoint: string, failedFetchOption: fetchOptions): Promise<Response> {
    const body = {
        clientName: CLIENT_NAME,
        password: CLIENT_PASSWORD
    }

    const options: fetchOptions = {
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

    //re-do failed request
    failedFetchOption.headers.Authorization = `Bearer ${jwt}`;
    const result = await fetch(API_URL + failedEndpoint, failedFetchOption)
        .catch(console.error);

    if (!result) throw new FetchAfterAuthError(failedEndpoint, failedFetchOption);
    return result;
}

export const guilds = 'guilds';
export const members = 'members';
export const playlists = 'playlists';
export const messages = 'messages';
export const roleReactions = 'roleReactions';

export async function get(endpoint: string): Promise<Response> {
    const options: fetchOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    }

    let response = await fetch(API_URL + endpoint, options);
    if (response.status == 403)
        response = await authenticateAndRedo(endpoint, options);

    return response;
}

export async function post(endpoint: string, body: any): Promise<Response> {
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    let response = await fetch(API_URL + endpoint, options);
    if (response.status == 403)
        response = await authenticateAndRedo(endpoint, options);

    return response;
}

export async function put(endpoint: string, body: any): Promise<Response> {
    const options = {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    let response = await fetch(API_URL + endpoint, options)
    if (response.status == 403)
        response = await authenticateAndRedo(endpoint, options);

    return response;
}

export async function patch(endpoint: string, body: any): Promise<Response> {
    const options = {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }

    let response = await fetch(API_URL + endpoint, options)
    if (response.status == 403)
        response = await authenticateAndRedo(endpoint, options);

    return response;
}

export async function del(endpoint: string): Promise<void> {
    const options = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        }
    }

    let response = await fetch(API_URL + endpoint, options);
    if (response.status == 403)
        response = await authenticateAndRedo(endpoint, options);

    else if (!response.ok)
        throw new DeleteError(endpoint);
}
