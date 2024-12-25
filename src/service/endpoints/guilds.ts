import { Guild } from 'discord.js';
import { guilds, get, post } from '../fetch-tools.js';


export async function getGuilds() {
    const response = await get(guilds)
    if (response.status === 200)
        return await response.json();
};

export async function getOrCreateGuild(guild: Guild) {
    const response = await get(`${guilds}/${guild.id}`)
    if (response.ok)
        return response.json();

    else if (response.status === 404) {
        return await exports.postGuild(guild);
    }
};

export async function getGuild(id: number) {
    const response = await get(`${guilds}/${id}`)
    if (response.ok)
        return await response.json();
};

export async function postGuild(guild: Guild) {
    const newGuild = { id: guild.id, name: guild.name };

    const response = await post(guilds, newGuild)
    if (response.ok)
        return await response.json();
};
