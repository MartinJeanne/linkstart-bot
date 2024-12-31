import { GuildMember } from "discord.js";

import { members, get, post, put, patch } from '../fetch-tools';
import { getOrCreateGuild } from './guilds';

export interface MemberDto {
    id: string;
    tag: string;
    guildsId: string[];
    avatar: string;
    birthday?: string;
}

export interface PatchMemberDto {
    id?: string;
    tag?: string;
    guildsId?: string[];
    avatar?: string;
    birthday?: string;
}

export function isMemberDto(obj: any): obj is MemberDto {
    return typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.tag === 'string' &&
        Array.isArray(obj.guildsId) &&
        obj.guildsId.every((id: any) => typeof id === 'string') &&
        typeof obj.avatar === 'string' &&
        (typeof obj.birthday === 'string' || obj.birthday instanceof Date);
}

export async function getOrCreateMember(member: GuildMember) {
    const response = await get(`${members}/${member.id}`);

    if (response.status === 200) {
        const apiMember = await response.json();
        if (!apiMember) throw new Error("No Member data on getOrCreateMember");

        const guild = await getOrCreateGuild(member.guild);
        if (!guild) throw new Error("Guild was not retrieved/created before getOrCreateMember!");

        if (!apiMember.guildsId.includes(guild.id)) {
            apiMember.guildsId.push(guild.id);
            return exports.putMember(apiMember);
        }
        return apiMember;
    }
    else if (response.status === 404)
        return await exports.postMember(member);
}

export async function getMember(id: number) {
    const response = await get(`${members}/${id}`);

    if (response.status === 200)
        return await response.json(); // todo check is memberRaw
}

export async function postMember(member: GuildMember) {
    const guild = await getOrCreateGuild(member.guild);
    if (!guild) throw new Error("Guild was not retrieved/created before postMember!");

    const newMember = {
        id: member.id,
        tag: member.user.tag,
        avatar: member.user.avatarURL(),
        guildsId: [member.guild.id]
    };

    const response = await post(members, newMember);
    if (response.status === 201)
        return await response.json();
}

export async function putMember(apiMember: MemberDto) {
    const modifiedMember = {
        id: apiMember.id,
        tag: apiMember.tag,
        guildsId: apiMember.guildsId,
        avatar: apiMember.avatar,
        birthday: apiMember.birthday
    }

    const response = await put(`${members}/${apiMember.id}`, modifiedMember);
    if (response.status === 200)
        return await response.json();
}

export async function patchMember(id: string, modifiedProperties: PatchMemberDto) {
    const response = await patch(`${members}/${id}`, modifiedProperties);
    if (response.status === 200)
        return await response.json();
}

export async function checkForBirthday() {
    const response = await get(`${members}/birthdayIsToday`)
    if (response.ok)
        return await response.json();
};
