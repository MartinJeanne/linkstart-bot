// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
// fs from node to navigate through commands files
const fs = require('node:fs');
// Player from discord-player to play music
const { Player } = require('discord-player')
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

// Once bot is started
client.once('ready', () => {
	console.log(`${client.user.tag} is ready!`)
});

// Slash commands events listener
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: "❌ Une erreur c'est produite lors de l'exécution de cette commande", ephemeral: true });
	}
});

// When member join the server
client.on('guildMemberAdd', member => {
	// Adding "Nouveau" to new user when they join the server
	member.roles.add('485021407529664526');
});

// When member leave the server
client.on('guildMemberRemove', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'chat-modérateur');
	channel.send(`Bye, ${member}`);
});

client.login(process.env.DISCORD_TOKEN); 
