const anniversaireCmd = require('../src/commands/divers/anniversaire')
const members = require('../src/endpoints/members'); // checkForBirthday

const mockedObjects = require('./mockedObjects');

jest.mock('../src/endpoints/members');

afterEach(() => {
    jest.clearAllMocks();
});

test('should save member birthday', () => {
    const interactionMock = mockedObjects.interactionAnniversaire;
    const memberMock = mockedObjects.member;
    const anniversaireCmdExc = jest.spyOn(anniversaireCmd, 'execute');
    const replySpy = jest.spyOn(interactionMock, 'editReply');
    members.patchMember.mockResolvedValue();

    return anniversaireCmd.execute(interactionMock, null, memberMock).then(() => {
        expect(anniversaireCmdExc).toHaveBeenCalledWith(interactionMock, null, memberMock);
        expect(members.patchMember).toHaveBeenCalledTimes(1);
        expect(replySpy).toHaveBeenCalledWith(`Ta date de naissance a été enregistrée : 01/12/----`);
    });
});
