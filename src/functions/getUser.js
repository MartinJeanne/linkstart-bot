const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async function (interaction) {
    const usersUrl = `${process.env.API_URL}/discordUsers`;
    const discordId = interaction.member.user.id;

    const user = await axios.get(usersUrl, discordId)
        .then(async response => {
            if (response.status !== 200) return null;

            const user = response.data._embedded?.discordUserDtoList?.[0];
            if (user) return user;

            const newUser = {
                discordId: discordId,
                tag: interaction.member.user.tag
            }

            const createdUser = await axios.post(usersUrl, newUser).catch(error => console.error(error));
            return createdUser.data;

        })
        .catch(error => console.error(error));

    return user;
};
