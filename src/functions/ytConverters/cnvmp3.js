const fs = require('node:fs');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const { useMainPlayer, QueryType } = require('discord-player');
const puppeteer = require('puppeteer');
const getQueue = require('../queue/getQueue.js');
const { addSongToQueue } = require('../queue/addSongsToQueue.js');


module.exports = async function (client, interaction) {
	const queue = await getQueue({ interaction: interaction, client: client, canCreate: true });
	if (!queue) return;

	// Puppeteer navigation to get dowload link from YT to mp3 converter
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, 'webdriver', { get: () => false });
	});

	const c = await page.createCDPSession()
	await c.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: 'C:/Users/marti/Music',
	})

	browser.on("targetcreated", async (target) => {
		const page = await target.page();
		if (page) page.close();
	});

	await page.goto('https://cnvmp3.com/');
	await page.type('#video-url', 'https://www.youtube.com/watch?v=i62sCK4-FLM', { delay: 100 });
	await page.click('label.converter-button-container', { delay: 200 });

	let title = 'No titleeee';
	let href;
	try {
		await page.waitForSelector('#downloadButton', { visible: true, timeout: 15000 }); // Attendre jusqu'à 15 secondes
		console.log('Le bouton #download est apparu');
		return await interaction.editReply('Trouvé ?');
		await browser.close();
	} catch (e) {
		await browser.close();
		console.error('Le bouton #download n\'est pas apparu dans le temps imparti');
		return await interaction.editReply('Pas trouvé mais normal');
	}

	// Playing the downloaded file
	/*const player = useMainPlayer();
	const result = await player.search(`soundbox-files/${title}.mp3`, {
		requestedBy: interaction.user.id,
		searchEngine: QueryType.FILE,
	});

	try {
		const reply = addSongToQueue(result.tracks[0], queue);
		await interaction.editReply(reply);
	} catch (error) {
		console.error(error);
		await interaction.editReply('❌ Erreur lors de la lecture de la musique');
	}*/
};
