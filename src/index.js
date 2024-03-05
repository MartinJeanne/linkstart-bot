// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits, Partials, REST, Routes } = require('discord.js');
// fs from node to navigate through commands files
const fs = require('node:fs');
// Player from discord-player to play music
const { Player } = require('discord-player');
// dotenv to use environnement variables in .env file
require('dotenv').config();
// Register bot Discord events
const registerEvents = require('./functions/registerEvents.js');

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Player to play music
client.player = new Player(client);

// The collection of commands
client.commands = new Collection();

// Information on commands that will be deployed to Discord API
const commandsToDeploy = [];

const folders = fs.readdirSync("src/commands");
for (const folder of folders) {
	const files = fs.readdirSync(`src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of files) {
		const command = require(`./commands/${folder}/${file}`);

		// Put commands in collection with the key as the command name and the value as the exported module
		client.commands.set(command.data.name, command);
		// Put command data in list to deploy it to Discord API
		commandsToDeploy.push(command.data.toJSON());
	}
}

// Before deploying commands
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	// Load all the extractors from the @discord-player/extractor package
	await client.player.extractors.loadDefault();

	// Deploy commands
	try {
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
