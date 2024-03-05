const { messages, get } = require('../functions/api-tools.js');

module.exports.getMessages = async function () {
    return get(messages)
        .then(({ response, data }) => {
            if (response.status === 200) return data;
        });
};
