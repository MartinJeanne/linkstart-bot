// Require the necessary discord.js classes
import {  GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
// To require all commands
import requireAll from 'require-all';
// Player from discord-player to play music
import { Player } from 'discord-player';
const { SpotifyExtractor, AttachmentExtractor } = require('@discord-player/extractor');
const { DeezerExtractor } = require("discord-player-deezer")

// Register bot Discord events
import registerEvents from './service/registerEvents/registerEvents';
import { ClientEx } from './model/Client'
import path from 'node:path';
import { NoEnvVarError } from './error/generalError/NoEnvVarError';


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
	dirname: path.join(__dirname, './command'),
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
});

// Player to play music
const player = new Player(client);

// Before deploying commands
if (!process.env.DISCORD_TOKEN) throw new NoEnvVarError('DISCORD_TOKEN');
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	// Load all the extractors from the @discord-player/extractor package
	//await player.extractors.register(YoutubeiExtractor, { });
	await player.extractors.loadMulti([SpotifyExtractor, AttachmentExtractor]);
	await player.extractors.register(DeezerExtractor, { decryptionKey: process.env.DEEZER_DECRYPTION_KEY });

	// Deploy commands
	try {
		if (!process.env.DISCORD_CLIENT_ID) throw new NoEnvVarError('DISCORD_CLIENT_ID');
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
