const members = require('../../src/endpoints/members');
const guilds = require('../../src/endpoints/guilds');
const fetchs = require('../../src/functions/fetch-tools');

const mockedObjects = require('../mockedObjects');
jest.mock('../../src/endpoints/guilds');
jest.mock('../../src/functions/fetch-tools');

afterEach(() => {
    jest.clearAllMocks();
});

test('should get member', () => {
    const response = mockedObjects.responseOK;
    const apiMember = mockedObjects.apiMember;

    const getSpy = jest.spyOn(members, 'getMember');
    fetchs.get.mockResolvedValue({ response, apiMember });

    return members.getMember(apiMember.id).then(member => {
        expect(getSpy).toHaveBeenCalledWith(apiMember.id);
        expect(fetchs.get).toHaveBeenCalledTimes(1);
        expect(member).toEqual(apiMember);
    });
});

test('should post member', () => {
    const response = mockedObjects.responseCREATED;
    const apiMember = mockedObjects.apiMember;

    const postSpy = jest.spyOn(members, 'postMember');
    fetchs.post.mockResolvedValue({ response, apiMember });
    guilds.getOrCreateGuild.mockResolvedValue(mockedObjects.guild);

    return members.postMember(mockedObjects.member).then(memberRes => {
        expect(postSpy).toHaveBeenCalledWith(mockedObjects.member);
        expect(fetchs.post).toHaveBeenCalledTimes(1);
        expect(memberRes).toEqual(apiMember);
    });
});

test('should put member', () => {
    const response = mockedObjects.responseOK;
    const apiMember = mockedObjects.apiMember;

    const putSpy = jest.spyOn(members, 'putMember');
    fetchs.put.mockResolvedValue({ response, apiMember });

    return members.putMember(apiMember).then(memberRes => {
        expect(putSpy).toHaveBeenCalledWith(apiMember);
        expect(fetchs.put).toHaveBeenCalledTimes(1);
        expect(memberRes).toEqual(apiMember);
    });
});


test('should patch member', () => {
    const response = mockedObjects.responseOK;
    const apiMember = mockedObjects.apiMember;
    const modifiedPropertie = { birthday: `1900-01-01` };

    const patchSpy = jest.spyOn(members, 'patchMember');
    fetchs.patch.mockResolvedValue({ response, apiMember });

    return members.patchMember(apiMember.id, modifiedPropertie).then(memberRes => {
        expect(patchSpy).toHaveBeenCalledWith(apiMember.id, modifiedPropertie);
        expect(fetchs.patch).toHaveBeenCalledTimes(1);
        expect(memberRes).toEqual(apiMember);
    });
});

test('should retrieve user which now is birthday member', () => {
    const response = mockedObjects.responseOK;
    const apiMember = mockedObjects.apiMember;
    const apiMembers = [apiMember];

    const checkForBirthdaySpy = jest.spyOn(members, 'checkForBirthday');
    fetchs.get.mockResolvedValue({ response, apiMembers });

    return members.checkForBirthday().then(memberRes => {
        expect(checkForBirthdaySpy).toHaveBeenCalledWith();
        expect(fetchs.get).toHaveBeenCalledTimes(1);
        expect(memberRes).toEqual(apiMembers);
    });
});
