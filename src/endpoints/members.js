const { members, get, post, put } = require('../functions/api-tools.js');
const { getOrCreateGuild } = require('./guilds.js');

exports.getOrCreateMember = async function (member) {
    return get(`${members}/${member.id}`)
        .then(async ({ response, data }) => {
            if (response.status === 200) {
                const apiMember = data;
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
        });
}

exports.getMember = async function (member) {
    return get(`${members}/${member.id}`)
        .then(async ({ response, apiMember }) => {
            if (response.status === 200) return apiMember;
        });
}

exports.postMember = async function (member) {
    const guild = await getOrCreateGuild(member.guild);
    if (!guild) throw new Error("Guild was not retrieved/created before postMember!");

    const newMember = {
        id: member.id,
        tag: member.user.tag,
        avatar: member.user.avatarURL(),
        guildsId: [member.guild.id]
    };

    return post(members, newMember)
        .then(({ response, data }) => {
            if (response.status === 201) return data;
        });
}


exports.putMember = async function (apiMember) {
    const modifiedMember = {
        id: apiMember.id,
        tag: apiMember.tag,
        guildsId: apiMember.guildsId,
        avatar: apiMember.avatar,
        birthday: apiMember.birthday
    }

    return put(`${members}/${apiMember.id}`, modifiedMember)
        .then(({ response, data }) => {
            if (response.status === 200) return data;
        });
}

exports.checkForBirthday = async function () {
    return get(`${members}/birthdayIsToday`)
        .then(({ response, data }) => {
            if (response.ok) return data;
        })
};
