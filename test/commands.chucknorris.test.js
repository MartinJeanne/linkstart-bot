const chucknorrisCmd = require('../src/commands/divers/chucknorris')

afterEach(() => {
    jest.clearAllMocks();
});

test('should have data in command', async () => {
    expect(chucknorrisCmd.data.name).toBeDefined();
    expect(chucknorrisCmd.data.description).toBeDefined();
    expect(chucknorrisCmd.data.description).toBeDefined();
});

test('should fetch data from chucknorris API', async () => {
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    expect(response.status).toBe(200);
});

test('should call fetch with the correct URL', async () => {
    fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ value: 'Chuck Norris joke' })
        })
    );

    const mockInteraction = {
        editReply: jest.fn()
    };

    await chucknorrisCmd.execute(mockInteraction);

    expect(fetch).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/random');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mockInteraction.editReply).toHaveBeenCalledWith("Chuck Norris joke");
});

test('should catch error and log it to console', async () => {
    fetch = jest.fn(() =>
        Promise.resolve({
            json: () => { throw Error('Testing, mock Error') }
        })
    );

    console.error = jest.fn();

    const mockInteraction = {
        editReply: jest.fn()
    };

    await expect(chucknorrisCmd.execute(mockInteraction));

    expect(fetch).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/random');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mockInteraction.editReply).toHaveBeenCalledTimes(0);
    // TODO expect(console.error).toHaveBeenCalledTimes(1);
});
