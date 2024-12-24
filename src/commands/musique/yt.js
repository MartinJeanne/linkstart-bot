const fs = require('node:fs');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, QueryType } = require('discord-player');
const jsdom = require('jsdom');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('yt')
		.setDescription('Télécharge et joue une musique youtube'),

	async execute(interaction, client) {
		const ytURL = 'https://s42.notube.lol/download.php?token=961ad9566296b13e0ea1c5ec5c2a676c&key=izoeaxgrlxv9s61m'; // Remplacer par l'URL réelle
		const outputLocationPath = './soundbox-files/fichier.mp3';

		const html = await fetch(`https://notube.lol/fr/youtube-app-49`)
			.then(response => response.text())
			.catch(console.error);

		const dom = await new jsdom.JSDOM(html);
		const input = await dom.window.document.querySelector('input#keyword');
		const okBtn = await dom.window.document.querySelector('input#submit-button');

		input.value = ytURL;
		okBtn.click();

		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`Erreur lors du téléchargement: ${response.statusText}`);

			const writeStream = fs.createWriteStream(outputLocationPath);
			await finished(Readable.fromWeb(response.body).pipe(writeStream));

			await interaction.editReply('Succès');
		} catch (error) {
			await interaction.editReply('Erreur');
		}

		/*
		const player = useMainPlayer();
		const queue = await getQueue({ interaction: interaction, client: client, canCreate: true });
		if (!queue) return;
		*/
	},
};
