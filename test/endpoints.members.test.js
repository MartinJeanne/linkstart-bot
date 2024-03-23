const members = require('../src/endpoints/members');
const guilds = require('../src/endpoints/guilds');
const fetchs = require('../src/functions/fetch-tools');

const mockedObjects = require('./mockedObjects');
jest.mock('../src/functions/fetch-tools');
jest.mock('../src/endpoints/guilds');


afterEach(() => {
    jest.clearAllMocks();
});

test('should get member', () => {
    const response = mockedObjects.responseOK;
    const apiMember = mockedObjects.apiMember;

    fetchs.get.mockResolvedValue({ response, apiMember });

    return members.getMember(apiMember.id).then(member => {
        expect(member).toEqual(apiMember);
    });
});

test('should post member', () => {
    const response = mockedObjects.responseCREATED;
    const apiMember = mockedObjects.apiMember;

    fetchs.post.mockResolvedValue({ response, apiMember });
    guilds.getOrCreateGuild.mockResolvedValue(mockedObjects.guild)

    return members.postMember(mockedObjects.member).then(memberRes => {
        expect(memberRes).toEqual(apiMember);
    });
});
