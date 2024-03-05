const { members, get, post, put } = require('../functions/api-tools.js');
const { getGuild } = require('./guilds.js');

exports.getMember = async function (member) {
    return get(`${members}/${member.id}`)
        .then(async ({ response, data }) => {
            if (response.status === 200)
                return data;

            else if (response.status === 404)
                return await exports.postMember(member);
        });
}

exports.postMember = async function (member) {
    const guild = await getGuild(member.guild);
    if (!guild) throw new Error("Guild was not retrieved/created before postMember!");

    const newMember = {
        id: member.id,
        tag: member.user.tag,
        avatar: member.user.avatarURL(),
        guildId: member.guild.id
    };

    return post(members, newMember)
        .then(({ response, data }) => {
            if (response.status === 201) return data;
        });
}


exports.putMember = async function (member) {
    await exports.getMember(member);

    const modifiedMember = {
        id: member.id,
        tag: member.user.tag,
        guildId: member.guild.id,
        avatar: member.user.avatarURL(),
        birthday: member.birthday
    }

    return put(`${members}/${member.id}`, modifiedMember)
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
