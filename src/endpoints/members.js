const { default: axios } = require('axios');
const dotenv = require('dotenv');
const { getGuild, postGuilds } = require('../endpoints/guilds.js');
dotenv.config();

const membersUrl = `${process.env.API_URL}/members`;

exports.getMember = async function (member) {
    return axios.get(`${membersUrl}/${member.id}`)
        .then(async response => {
            if (response.status === 200 && response.data) return response.data;
            else return await exports.postMember(member);
        })
        .catch(console.error);
};

exports.postMember = async function (member) {
    await getGuild(member.guild.id)
        .then(async guild => {
            if (!guild) await postGuilds(member.guild);
        })
        .catch(console.error);

    const newUser = {
        id: member.id,
        tag: member.user.tag,
        avatar: member.user.avatarURL(),
        guildId: member.guild.id
    }

    return axios.post(membersUrl, newUser)
        .then(response => {
            if (response.status === 201 && response.data) return response.data;
        })
        .catch(console.error);
}

exports.getUserPlaylists = async function (user) {
    return axios.get(`${membersUrl}/${user.id}/playlists`)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(error => console.error(error));
};

exports.checkForBirthday = async function () {
    return axios.get(`${membersUrl}/checkBirthdayIsToday`)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(error => console.error(error));
};
