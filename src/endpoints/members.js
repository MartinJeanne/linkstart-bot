const { default: axios } = require('axios');
const { getGuild, postGuild } = require('../endpoints/guilds.js');
const { membersUrl } = require('../functions/endpointsUrl.js');

exports.getMember = async function (member) {
    return axios.get(`${membersUrl}/${member.id}`)
        .then(async response => {
            if (response.status === 200 && response.data)
                return response.data;

            else return await exports.postMember(member);
        })
        .catch(console.error);
};

exports.postMember = async function (member) {
    await getGuild(member.guild.id)
        .then(async guild => {
            if (!guild) await postGuild(member.guild);
        })
        .catch(console.error);

    const newMember = {
        id: member.id,
        tag: member.user.tag,
        avatar: member.user.avatarURL(),
        guildId: member.guild.id
    }

    return axios.post(membersUrl, newMember)
        .then(response => {
            if (response.status === 201 && response.data)
                return response.data;
        })
        .catch(console.error);
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

    return axios.put(`${membersUrl}/${member.id}`, modifiedMember)
        .then(response => {
            if (response.status === 200 && response.data)
                return response.data;
        })
        .catch(console.error);
}

exports.checkForBirthday = async function () {
    return axios.get(`${membersUrl}/birthdayIsToday`)
        .then(response => {
            if (response.status === 200)
                return response.data;
        })
        .catch(console.error);
};
