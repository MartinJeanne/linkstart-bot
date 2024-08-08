const { ActivityType } = require('discord.js');
const { Rcon } = require('rcon-client');

const RCON_HOST = process.env.RCON_HOST;
const RCON_PORT = process.env.RCON_PORT;
const RCON_PASSWORD = process.env.RCON_PASSWORD;

async function connectRcon() {
    try {
        rcon = new Rcon({
            host: RCON_HOST,
            port: RCON_PORT,
            password: RCON_PASSWORD
        });

        await rcon.connect();
        console.log('Connected to RCON');

        rcon.on('end', () => {
            console.log('RCON connection ended, reconnecting...');
            setTimeout(connectRcon, 5000); // Reconnect after 5 seconds
        });
    } catch (error) {
        console.error('Error connecting to RCON:', error);
        setTimeout(connectRcon, 5000); // Retry after 5 seconds on failure
    }
}

let previousplayerCount = -1; // commence à -1, pour que la première execution change forcément le status
async function updateBotStatus(client) {
    try {
        const response = await rcon.send('list');
        const match = response.match(/There are (\d+) of a max of \d+ players online: (.*)/);
        const playerCount = parseInt(match[1], 10);

        if (playerCount !== previousplayerCount) {
            client.user.setActivity({ name: `minecraft : ${playerCount}/20`, type: ActivityType.Playing });
            previousplayerCount = playerCount;
        }
    } catch (error) {
        console.error('Error fetching player list:', error);
    }
}

exports.matchBotStatusToMcPlayerNb = async function (client) {
    await connectRcon();
    await updateBotStatus(client); // for bot startup

    setInterval(() => {
        updateBotStatus(client); // then every minute
    }, 60000);
}
