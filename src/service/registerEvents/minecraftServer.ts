import { ActivityType } from 'discord.js';
import { Rcon } from 'rcon-client';
import { NoEnvVarError } from '../../error/generalError/NoEnvVarError';
import { ClientEx } from '../../model/Client';
import { NoClientUserError } from '../../error/generalError/ClientUserError';

async function connectRcon() {
    if (!process.env.RCON_HOST || !process.env.RCON_PORT || !process.env.RCON_PASSWORD)
        throw new NoEnvVarError('RCON_HOST || RCON_PORT || RCON_PASSWORD');

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

let previousPlayersNb = -1; // commence à -1, pour que la première execution change forcément le status
async function updateBotStatus(rcon: Rcon, client: ClientEx) {

    const response = await rcon.send('list');
    const match = response.match(/There are (\d+)\/(\d+) players online:(.*)/);
    if (!match) throw new Error('No match found while retrieving player count');
    const playersNb = parseInt(match[1], 10);
    const maxPlayerNb = parseInt(match[2], 10);
    const playerList = match[3] ? match[3].split(', ') : [];

    if (playersNb !== previousPlayersNb) {
        if (!client.user) throw new NoClientUserError();
        client.user.setActivity({ name: `serveur mc : ${playersNb}/${maxPlayerNb}`, type: ActivityType.Playing });
        previousPlayersNb = playersNb;
    }
}

export async function matchBotStatusToMcPlayerNb(client: ClientEx) {
    try {
        const rcon = await connectRcon();
        if (!rcon) throw new Error('No rcon connection');

        updateBotStatus(rcon, client); // for bot startup
        setInterval(() => {
            updateBotStatus(rcon, client); // then every 30 sec
        }, 30000);

    } catch (error) {
        console.error('Error fetching player list:', error);
    }
}
