const { roleReactions, get } = require('../fetch-tools.js');

module.exports.getRoleReaction = async function (id, reaction) {
    const queryParams = `?id=${id}&reaction=${reaction}`
    
    return get(roleReactions + queryParams)
        .then(({ response, data }) => {
            if (response.ok) return data;
        });
};
