const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aide')
		.setDescription('Obtient des informations sur mes commandes'),

	async execute(interaction, client) {
		await interaction.deferReply();

		const commands = [];

		const commandFolders = fs.readdirSync("src/commands");
		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`src/commands/${folder}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../${folder}/${file}`);
				commands.push({ fodler: folder, data: command.data });
			}
		}

		const embed = new EmbedBuilder()
			.setColor(0x6df4d0)
			.setTitle('Liste des commandes')
			.setTimestamp()
			.setFooter({ text: `Merci !`, iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128' });

		let folderName = '';
		for (let i = 0; i < commands.length; i++) {
			if (commands[i].fodler != folderName) {
				folderName = commands[i].fodler;
				let title = folderName;
				title = title.charAt(0).toUpperCase() + title.slice(1); // First letter uppercase
				embed.addFields({ name: '\u200B', value: `__**${title}**__` });
			}
			embed.addFields({ name: commands[i].data.name, value: commands[i].data.description });
		}

		await interaction.editReply({ embeds: [embed] });
	},
};