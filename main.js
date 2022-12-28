// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const { Player } = require('discord-player')

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

// Player attached to the client, to play music
client.player = new Player(client, {
	ytdlOptions: {
		quality: "highestaudio",
		highWaterMark: 1 << 25
	}
})

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


client.once('ready', () => {
	console.log(`${client.user.tag} is ready!`)
});

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

client.on('guildMemberAdd', member => {
	// Adding "Nouveau" to new user when they join the server
	member.roles.add('485021407529664526');
});

client.on('guildMemberRemove', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'chat-modérateur');
	channel.send(`Bye, ${member}`);
});

const { token } = require('./ressources/config.json');
client.login(token); 
