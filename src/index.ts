// Require the necessary discord.js classes
import { Client, Collection, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
// fs from node to navigate through commands files
import fs from 'node:fs';
// To require all commands
import requireAll from 'require-all';
// Player from discord-player to play music
import { Player } from 'discord-player';
const { SpotifyExtractor, AttachmentExtractor } = require('@discord-player/extractor');
const { DeezerExtractor } = require("discord-player-deezer")
const { YoutubeiExtractor } = require("discord-player-youtubei")

// Register bot Discord events
import registerEvents from './service/registerEvents/registerEvents';
import { ClientEx } from './model/Client'
import path, { dirname } from 'node:path';


// Create a new client instance
const client = new ClientEx({
	intents: [
		GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Information on commands that will be deployed to Discord API
const commandsToDeploy: any = [];


requireAll({
	dirname: path.join(__dirname, './commands'),
	filter: /\w*.[tj]s/g,
	recursive: true,
	resolve: x => {
		let command;
		if (x.default) command = x.default;
		else command = x;

		// Put commands in collection with the key as the command name and the value as the exported module
		client.commands.set(command.data.name, command);
		// Put command data in list to deploy it to Discord API
		commandsToDeploy.push(command.data.toJSON());
	}
})

/*const folders = fs.readdirSync("src/commands");
for (const folder of folders) {
	const files = fs.readdirSync(`src/commands/${folder}`)
		.filter((file: string) => file.endsWith('.js') || file.endsWith('.ts')); // todo remove js

	for (const file of files) {
		const command = require(`./commands/${folder}/${file}`);

		// Put commands in collection with the key as the command name and the value as the exported module
		client.commands.set(command.data.name, command);
		// Put command data in list to deploy it to Discord API
		commandsToDeploy.push(command.data.toJSON());
	}
}*/

// Player to play music
const player = new Player(client);

// Before deploying commands
if (!process.env.DISCORD_TOKEN) throw new Error('The DISCORD_TOKEN environment variable is not defined.');
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	// Load all the extractors from the @discord-player/extractor package
	//const agent = new ProxyAgent('http://username:mdp@192.168.1.254:8080');
	//await player.extractors.register(YoutubeiExtractor, { });
	await player.extractors.loadMulti([SpotifyExtractor, AttachmentExtractor]);
	await player.extractors.register(DeezerExtractor, { decryptionKey: process.env.DEEZER_DECRYPTION_KEY });

	// Deploy commands
	try {
		if (!process.env.DISCORD_CLIENT_ID) throw new Error('The DISCORD_CLIENT_ID environment variable is not defined.');
		await rest.put(
			Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
			{ body: commandsToDeploy }
		);
		console.log(`Commandes slash (/) rechargées !`);
	} catch (error) {
		console.error(error);
	}
})();

// Register all bot events
registerEvents(client);

// Launch the bot
client.login(process.env.DISCORD_TOKEN);
