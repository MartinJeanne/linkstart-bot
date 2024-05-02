const chucknorrisCmd = require('../../src/commands/divers/chucknorris');

afterEach(() => {
    jest.clearAllMocks();
});

test('should have data about the command', async () => {
    expect(chucknorrisCmd.data.name).toBeDefined();
    expect(chucknorrisCmd.data.description).toBeDefined();
    expect(chucknorrisCmd.data.description).toBeDefined();
});

test('should fetch data from the chucknorris API', async () => {
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    expect(response.status).toBe(200);
});

test('should call fetch with the correct API URL', async () => {
    fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ value: 'Chuck Norris joke' })
        })
    );

    const mockInteraction = {
        editReply: jest.fn()
    };

    return chucknorrisCmd.execute(mockInteraction).then(() => {
        expect(fetch).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/random');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockInteraction.editReply).toHaveBeenCalledWith("Chuck Norris joke");

    });
});

test('should catch error and log it to console & user if fetch failed', async () => {
    fetch = jest.fn(() =>
        Promise.resolve({
            json: () => { throw new Error('Testing, mock Error') }
        })
    );

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockInteraction = {
        editReply: jest.fn()
    };

    return chucknorrisCmd.execute(mockInteraction).then(() => {
        expect(fetch).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/random');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockInteraction.editReply).toHaveBeenCalledWith('❌ Erreur lors de la récupération de la blague');
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});
