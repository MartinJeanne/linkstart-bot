import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import fs from 'node:fs';


export default {
	data: new SlashCommandBuilder()
		.setName('aide')
		.setDescription('Obtient des informations sur mes commandes'),

	async execute(interaction: ChatInputCommandInteraction) {
		const commands = [];

		const commandFolders = fs.readdirSync("src/command");
		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`src/command/${folder}`)
                .filter(file => file.endsWith('.js') || file.endsWith('.ts'));
			for (const file of commandFiles) {
				let command = require(`../${folder}/${file}`);
				command = command.default;
				commands.push({ folder: folder, data: command.data });
			}
		}

		const embed = new EmbedBuilder()
			.setColor(0x6df4d0)
			.setTitle('Liste des commandes')
			.setTimestamp()
			.setFooter({ text: `Merci !`, iconURL: 'https://cdn.discordapp.com/avatars/784536536459771925/03a8dc68b874f740def806a36675633e.webp?size=128' });

		let lastFolder = '';
		for (let i = 0; i < commands.length; i++) {
			if (commands[i].folder != lastFolder) {
				lastFolder = commands[i].folder;
				const title = lastFolder.charAt(0).toUpperCase() + lastFolder.slice(1); // First letter uppercase
				embed.addFields({ name: '\u200B', value: `__***${title} :***__` });
			}
			embed.addFields({ name: commands[i].data.name, value: commands[i].data.description });
		}

		await interaction.editReply({ embeds: [embed] });
	}
};

