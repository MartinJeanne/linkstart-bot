const fs = require('node:fs');
const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands })
	.then(() => console.log('Les commandes ont été correctement enregistrées !'))
	.catch(console.error);