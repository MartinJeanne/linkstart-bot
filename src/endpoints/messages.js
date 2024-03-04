const { default: axios } = require('axios');
const { messagesUrl } = require('../functions/endpointsUrl.js');

module.exports.getMessages = async function () {
    return axios.get(messagesUrl)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(console.error);
};
