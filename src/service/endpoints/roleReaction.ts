import { roleReactions, get } from '../fetch-tools.js';

export async function getRoleReaction(id: number, reaction: string) {
    const queryParams = `?id=${id}&reaction=${reaction}`

    const response = await get(roleReactions + queryParams);
    if (response.ok)
        return await response.json();
}
