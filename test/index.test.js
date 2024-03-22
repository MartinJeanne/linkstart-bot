const birthdayAdvertiser = require('../src/functions/birthdayAdvertiser')
const members = require('../src/endpoints/members'); // checkForBirthday
const guilds = require('../src/endpoints/guilds'); // getGuild

jest.mock('../src/endpoints/members');
jest.mock('../src/endpoints/guilds');

const memberBirthdayRes = [{
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
}];

const guildsRes = {
    id: "485000880114892821",
    name: "Link start !",
    botChannelId: "485003552251445258",
    membersId: [
        "306129521990565888"
    ]
};

members.checkForBirthday.mockResolvedValue(memberBirthdayRes);
guilds.getGuild.mockResolvedValue(guildsRes);

const client = {
    channels: {
        cache: {
            get: () => channel
        }
    }
};

const channel = {
    toCheck: null,
    send: (msg) => channel.toCheck = msg
};


afterEach(() => {
    jest.clearAllMocks();
});

test('should call one time members.checkForBirthday', () => {
    return birthdayAdvertiser(client).then(data => {
        expect(members.checkForBirthday).toHaveBeenCalledTimes(1);
    });
});

test('should call all 5 guilds.getGuild', () => {
    return birthdayAdvertiser(client).then(data => {
        expect(guilds.getGuild).toHaveBeenCalledTimes(5);
    });
});


test('should send message to channel', () => {
    return birthdayAdvertiser(client).then(data => {
        expect(channel.toCheck).toEqual(`Bon anniversaire <@${memberBirthdayRes[0].id}> ! 😎`);
    });
});

// todo coverage