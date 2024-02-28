const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const membersUrl = `${process.env.API_URL}/members`;

module.exports.getMember = async function (member) {
    return axios.get(`${membersUrl}/${member.id}`)
        .then(async response => {
            if (response.status === 200 && response.data) return response.data;

            const newUser = {
                id: member.id,
                tag: member.user.tag,
                avatarURL: member.avatarURL(),
                guildId: member.guild.id
            }

            const createdUser = await axios.post(membersUrl, newUser).catch(error => console.error(error));
            return createdUser.data;
        })
        .catch(error => console.error(error));
};

module.exports.getUserPlaylists = async function (user) {
    return axios.get(`${membersUrl}/${user.discordId}/playlists`)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(error => console.error(error));
};

module.exports.checkForBirthday = async function () {
    return axios.get(`${membersUrl}/checkBirthdayIsToday`)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(error => console.error(error));
};
