import {ActivityType, TextChannel} from 'discord.js';
import {ClientEx} from '../../model/Client';
import {NoClientUserError} from '../../error/generalError/ClientUserError';
import GeneralError from "../../error/generalError/GeneralError";

export async function setBotStatusToHytalePlayerNb(client: ClientEx) {
    setInterval(async () => {
        try {
            await updateBotStatus(client);
        } catch (error) {
            previousPlayersNb = -1;
            console.error('Error fetching player list:', error);
        }
    }, 30_000); // 30 sec
}

interface NitradoResponse {
    Players: string[];
}


function isNitradoResponse(response: any): response is NitradoResponse {
    return typeof response === 'object' && Array.isArray(response.Players);
}

let previousPlayersNb = -1; // commence à -1, pour que la première execution change forcément le status
async function updateBotStatus(client: ClientEx) {

    const result = await fetch(process.env.HYTALE_WEB_SERVER_URL + "/Nitrado/Query", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.HYTALE_WEB_SERVER_AUTH as string,
        }
    }).then(r => r.json());

    if (!isNitradoResponse(result)) throw new GeneralError("Not a NitradoResponse");
    const playersNb = result.Players.length;

    if (playersNb !== previousPlayersNb) {
        if (!client.user) throw new NoClientUserError();
        client.user.setActivity({name: `Joueurs sur Hytale : ${playersNb}`, type: ActivityType.Playing});
        previousPlayersNb = playersNb;
        if (playersNb > 0) {
            const channel = await client.channels.fetch("788781047420420137") as TextChannel;
            if (!channel || !channel.isTextBased()) throw new GeneralError("Channel not found");
            const log = "Player(s) connected: " + result.Players.toString();
            await channel.send(log);
        }
    }
}
