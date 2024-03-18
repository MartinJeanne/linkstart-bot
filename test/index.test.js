const mockCheckForBirthday = jest.fn(x => 42 + x);

test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
});

// Ici on test fetchData
test('la donnée est peanut butter', () => {
    return fetchData().then(data => {
        expect(data).toBe('peanut butter');
    });
});


jest.mock('axios');

test('should fetch users', () => {
    const users = [{ name: 'Bob' }];
    const resp = { data: users };
    axios.get.mockResolvedValue(resp);

    // or you could use the following depending on your use case:
    // axios.get.mockImplementation(() => Promise.resolve(resp))

    return Users.all().then(data => expect(data).toEqual(users));
});
