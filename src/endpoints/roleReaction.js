const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const roleReactionsUrl = `${process.env.API_URL}/roleReactions`;

module.exports.getRoleReaction = async function (id, reaction) {
    const queryParams = { id, reaction }
    
    return axios.get(roleReactionsUrl, { params: queryParams })
        .then(response => {
            if (response.status === 200) return response.data;
        })
        .catch(error => console.error(error));
};
