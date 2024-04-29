const birthdayAdvertiser = require('../src/functions/birthdayAdvertiser')
const members = require('../src/endpoints/members'); // checkForBirthday
const guilds = require('../src/endpoints/guilds'); // getGuild

const mockedObjects = require('./mockedObjects');

jest.mock('../src/endpoints/members');
jest.mock('../src/endpoints/guilds');

const memberBirthdayRes = [mockedObjects.apiMember];

members.checkForBirthday.mockResolvedValue(memberBirthdayRes);
guilds.getGuild.mockResolvedValue(mockedObjects.guild);

afterEach(() => {
    jest.clearAllMocks();
});

test('should call one time members.checkForBirthday', () => {
    return birthdayAdvertiser(mockedObjects.client).then(data => {
        expect(members.checkForBirthday).toHaveBeenCalledTimes(1);
    });
});

test('should call all 5 guilds.getGuild', () => {
    return birthdayAdvertiser(mockedObjects.client).then(data => {
        expect(guilds.getGuild).toHaveBeenCalledTimes(5);
    });
});

test('should send message to channel', () => {
    const sendSpy = jest.spyOn(mockedObjects.channel, 'send');

    return birthdayAdvertiser(mockedObjects.client).then(data => {
        expect(sendSpy).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalledTimes(5);
        expect(sendSpy).toHaveBeenCalledWith(`Bon anniversaire <@${mockedObjects.apiMember.id}> ! 😎`);
    });
});
