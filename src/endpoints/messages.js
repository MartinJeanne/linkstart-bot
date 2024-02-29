const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const messagesUrl = `${process.env.API_URL}/messages`;

module.exports.getMessages = async function () {
    return axios.get(messagesUrl)
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(console.error);
};
