const donardtrumpCmd = require('../../src/commands/divers/donaldtrump');

const API_URL = 'https://www.tronalddump.io/random/quote';

afterEach(() => {
    jest.restoreAllMocks();
});

test('should have data about the command', () => {
    expect(donardtrumpCmd.data.name).toBeDefined();
    expect(donardtrumpCmd.data.description).toBeDefined();
    expect(donardtrumpCmd.data.description).toBeDefined();
});

test('should call fetch with the correct API URL', () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve({
                value: 'Idiot quote',
                appeared_at: '2015-09-05T21:42:32.000Z'
            })
        })
    );

    const mockInteraction = {
        editReply: jest.fn()
    };

    return donardtrumpCmd.execute(mockInteraction).then(() => {
        expect(fetchSpy).toHaveBeenCalledWith(API_URL);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(mockInteraction.editReply).toHaveBeenCalledWith('"*Idiot quote*" - Donald Trump, 2015-09-05');
    });
});

test('should catch error and log it to console & user if fetch failed', () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
            json: () => { throw new Error('Testing, mock Error') }
        })
    );

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockInteraction = {
        editReply: jest.fn()
    };

    return donardtrumpCmd.execute(mockInteraction).then(() => {
        expect(fetchSpy).toHaveBeenCalledWith(API_URL);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(mockInteraction.editReply).toHaveBeenCalledWith('❌ Erreur lors de la récupération de la blague');
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
});

test('should fetch data from the chucknorris API (TI)', async () => {
    const response = await fetch(API_URL);
    expect(response.status).toBe(200);
});

test('should fetch a joke (TI)', () => {
    const mockInteraction = {
        editReply: jest.fn()
    };

    return donardtrumpCmd.execute(mockInteraction).then(() => {
        expect(mockInteraction.editReply).toHaveBeenCalledWith(expect.anything());
    });
});
