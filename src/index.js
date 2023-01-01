// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
// fs from node to navigate through commands files
const fs = require('node:fs');
// Player from discord-player to play music
const { Player } = require('discord-player')
// Register my Discord events
const registerEvents = require('./functions/registerEvents.js');
// dotenv to use environnement variables in .env file
const dotenv = require('dotenv');
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

// Player to play music
client.player = new Player(client);

client.commands = new Collection();

// Getting all commands folders, and then commands files
const commandFolders = fs.readdirSync("src/commands");
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		// Put item in Collection with the key as the command name and the value as the exported module
		client.commands.set(command.data.name, command);
	}
}

registerEvents(client);

// Slash commands events listener
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await interaction.deferReply(); // make Discord API wait for reply
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.editReply({ content: "❌ Une erreur c'est produite lors de l'exécution de cette commande, reportez ce problème à un modérateur", ephemeral: true });
	}
});

client.login(process.env.DISCORD_TOKEN); 
