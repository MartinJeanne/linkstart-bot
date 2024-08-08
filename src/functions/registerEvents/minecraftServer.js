const { ActivityType } = require('discord.js');
const { Rcon } = require('rcon-client');

const RCON_HOST = 'linkstart-minecraft-server'; // L'adresse IP du serveur Minecraft
const RCON_PORT = 25575; // Le port RCON configuré
const RCON_PASSWORD = 'ac9f57699983f48af454b94a';

async function getPlayerList() {
    const rcon = new Rcon({
        host: RCON_HOST,
        port: RCON_PORT,
        password: RCON_PASSWORD
    });

    await rcon.connect();
    const response = await rcon.send('list');
    await rcon.end();

    const match = response.match(/There are (\d+) of a max of \d+ players online: (.*)/);
    const playerCount = parseInt(match[1], 10);
    const playerList = match[2] ? match[2].split(', ') : [];

    return { playerCount, playerList };
}

let previousPlayerList = [null]; // commence à null, pour que la première execution change forcément le status
exports.updateBotStatus = async function (client) {
    try {
        const { playerCount, playerList } = await getPlayerList();

        // Détecter les changements dans la liste des joueurs
        if (JSON.stringify(previousPlayerList) !== JSON.stringify(playerList)) {
            previousPlayerList = playerList;
            client.user.setActivity({ name: `minecraft : ${playerCount}/20`, type: ActivityType.Playing });
        }
    } catch (error) {
        console.error('Error fetching player list:', error);
    }
}
