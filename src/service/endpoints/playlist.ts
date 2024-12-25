import { GuildMember } from "discord.js";
import { playlists, members, get, post, del } from '../fetch-tools';


export async function getUserPlaylists(user: GuildMember) {
    const response = await get(`${members}/${user.id}/${playlists}`)
    if (response.ok)
        return await response.json();
};

export async function postPlaylist(member: GuildMember, name: string, url: string) {
    const newPlaylist = {
        name: name ? name : "Ma playlist",
        url
    };

    const queryParam = `?memberId=${member.id}`;

    const response = await post(playlists + queryParam, newPlaylist)
    if (response.ok)
        return await response.json();
};

export async function deletePlaylist(id: number) {
    del(`${playlists}/${id}`);
};
