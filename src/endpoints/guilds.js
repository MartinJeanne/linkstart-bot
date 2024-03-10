const { guilds, get, post } = require('../functions/fetch-tools.js');


module.exports.getGuilds = async function () {
    return get(guilds)
        .then(({ response, data }) => {
            if (response.status === 200) return data;
        });
};

module.exports.getOrCreateGuild = async function (guild) {
    return get(`${guilds}/${guild.id}`)
        .then(async ({ response, data }) => {
            if (response.ok) return data;

            else if (response.status === 404) {
                return await exports.postGuild(guild);
            }
        });
};

module.exports.getGuild = async function (id) {
    return get(`${guilds}/${id}`)
        .then(async ({ response, data }) => {
            if (response.ok) return data;
        });
};

module.exports.postGuild = async function (guild) {
    const newGuild = { id: guild.id, name: guild.name };

    return post(guilds, newGuild)
        .then(({ response, data }) => {
            if (response.ok) return data;
        });
};
