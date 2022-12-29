const fs = require('node:fs');
const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const commands = [];

const commandFolders = fs.readdirSync("src/commands");
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
		console.log(`Commandes (/) rechargées !`);
	} catch (error) {
		console.error(error);
	}
})();
