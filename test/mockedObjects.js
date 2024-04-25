exports.member = {
    id: "306129521990565888",
    user: {
        tag: "garwalle",
        avatarURL: () => 'http://avatar.com'
    },
    guild: {
        id: "1091796334568288346",
    },
};

exports.apiMember = {
    id: "306129521990565888",
    tag: "garwalle",
    guildsId: [
        "1091796334568288346",
        "485000880114892821",
        "790642467405692979",
        "1073323064852484116",
        "1031873391629705216"
    ],
    avatar: "https://cdn.discordapp.com/avatars/306129521990565888/b500ec99ff080e0f30c37b47d17f79bb.webp",
    birthday: "1900-12-01"
};

exports.guild = {
    id: "485000880114892821",
    name: "Link start !",
    botChannelId: "485003552251445258",
    membersId: [
        "306129521990565888"
    ]
};

exports.responseOK = {
    status: 200,
    ok: true
};

exports.responseCREATED = {
    status: 201,
    ok: true
};

exports.client = {
    channels: {
        cache: {
            get: () => exports.channel
        }
    }
};

exports.channel = {
    send: (msg) => { } // Spy on this method
};
