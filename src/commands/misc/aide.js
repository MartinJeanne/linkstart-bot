const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aide')
		.setDescription('Obtient des informations sur mes commandes'),

	async execute(interaction, client) {

		const commands = [];

		const commandFolders = fs.readdirSync("src/commands");
		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`src/commands/${folder}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../${folder}/${file}`);
				commands.push(command.data);
			}
		}

		console.log(commands);
		return await interaction.editReply(`Voici la liste des commandes :\n${commands}`);
	},
};