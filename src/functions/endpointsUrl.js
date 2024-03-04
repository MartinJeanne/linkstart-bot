const dotenv = require('dotenv');
dotenv.config();

const API_URL = process.env.API_URL + "/";

exports.guilds = 'guilds';
exports.members = 'members';
exports.playlists = 'playlists';
exports.messages = 'messages';
exports.roleReactions = 'roleReactions';


exports.guildsUrl = API_URL + exports.guilds;
exports.membersUrl = API_URL + exports.members;
exports.playlistsUrl = API_URL + exports.playlists;
exports.messagesUrl = API_URL + exports.messages;
exports.roleReactionsUrl = API_URL + exports.roleReactions;
