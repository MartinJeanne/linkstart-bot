import { ActivityType } from 'discord.js';
import { Rcon } from 'rcon-client';
import { NoEnvVarError } from '../../error/NoEnvVarError';
import { ClientEx } from '../../model/Client';
import { NoClientUserError } from '../../error/ClientUserError';

async function connectRcon() {
    if (!process.env.RCON_HOST || !process.env.RCON_PORT || !process.env.RCON_PASSWORD)
        throw new NoEnvVarError('RCON_HOST || RCON_HOST || RCON_PASSWORD');

    const rcon = new Rcon({
        host: process.env.RCON_HOST,
        port: parseInt(process.env.RCON_PORT),
        password: process.env.RCON_PASSWORD
    });

    await rcon.connect();
    console.log('Connected to RCON');

    rcon.once('end', () => {
        console.log('RCON connection ended, reconnecting...');
        setTimeout(connectRcon, 5000); // Reconnect after 5 seconds
    });

    return rcon;
}

let previousplayerCount = -1; // commence à -1, pour que la première execution change forcément le status
async function updateBotStatus(rcon: Rcon, client: ClientEx) {

    const response = await rcon.send('list');
    const match = response.match(/There are (\d+) of a max of \d+ players online: (.*)/);
    if (!match) throw new Error('No match found while retrieving player count');
    const playerCount = parseInt(match[1], 10);
    const playerList = match[2] ? match[2].split(', ') : [];

    if (playerCount !== previousplayerCount) {
        if (!client.user) throw new NoClientUserError();
        client.user.setActivity({ name: `minecraft : ${playerCount}/20`, type: ActivityType.Playing });
        previousplayerCount = playerCount;
    }
}

export async function matchBotStatusToMcPlayerNb(client: ClientEx) {
    try {
        const rcon = await connectRcon();
        if (!rcon) throw new Error('No rcon connection');

        updateBotStatus(rcon, client); // for bot startup
        setInterval(() => {
            updateBotStatus(rcon, client); // then every 3 0 sec
        }, 30000);

    } catch (error) {
        console.error('Error fetching player list:', error);
    }
}
