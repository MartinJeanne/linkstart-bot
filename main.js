// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
//const { token } = require('./ressources/config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	const channel = client.channels.cache.get('630492112562946048');
    if (!channel) return;
    channel.send("I'm up!");
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.on('guildMemberAdd', member => {
    member.roles.add('485021407529664526');
});


client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'chat-modérateur');
    if (!channel) return;
    channel.send(`Bye, ${member}`);
});

client.login(process.env.TOKEN); // process.env.TOKEN
// git push heroku master