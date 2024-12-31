import { messages, get } from '../fetch-tools.js';

export async function getMessages() {
    const response = await get(messages)
    if (response.status === 200)
        return await response.json();
};
