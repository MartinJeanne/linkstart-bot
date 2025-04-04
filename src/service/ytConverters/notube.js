const fs = require('node:fs');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const { useMainPlayer, QueryType } = require('discord-player');
const puppeteer = require('puppeteer');
const getQueue = require('../queue/getQueue.js');
const { addSongToQueue } = require('../queue/addSongsToQueue.js');


module.exports = async function (interaction) {
	const queue = await getQueue({ interaction: interaction, canCreate: true });

	// Puppeteer navigation to get dowload link from YT to mp3 converter
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, 'webdriver', { get: () => false });
	});

	browser.on("targetcreated", async (target) => {
		const page = await target.page();
		if (page) page.close();
	});

	await page.goto('https://notube.lol/fr/youtube-app-49');
	await page.type('#keyword', 'https://www.youtube.com/watch?v=To4SWGZkEPk', { delay: 100 });
	await page.click('#submit-button', { delay: 200 });

	let title = 'No title';
	let href;
	try {
		await page.waitForSelector('#downloadButton', { visible: true, timeout: 15000 }); // Attendre jusqu'à 15 secondes
		console.log('Le bouton #download est apparu');
		title = await page.$eval('#blocLinkDownload>h2', h2 => h2.textContent);
		href = await page.$eval('#downloadButton', a => a.href);
		await browser.close();
	} catch (e) {
		await browser.close();
		console.error('Le bouton #download n\'est pas apparu dans le temps imparti');
		return await interaction.editReply('❌ Erreur, boutton de téléchargement non trouvé. Le site a sûrement bloqué le bot');
	}

	// Downloading with fetch the music file, with the ling obtained before
	try {
		const response = await fetch(href);
		if (!response.ok) throw new Error(`Erreur lors du téléchargement: ${response.statusText}`);

		const writeStream = fs.createWriteStream(`./soundbox-files/${title}.mp3`);
		await finished(Readable.fromWeb(response.body).pipe(writeStream));
		console.log('Musique téléchargé !');
	} catch (error) {
		console.error(error);
		return await interaction.editReply('❌ Erreur lors du téléchargement de la musique');
	}

	// Playing the downloaded file
	const player = useMainPlayer();
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
	}
};
