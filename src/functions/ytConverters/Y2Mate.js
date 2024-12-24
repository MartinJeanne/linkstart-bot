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
		downloadPath: './soundbox-files'
	})

	browser.on("targetcreated", async (target) => {
		const page = await target.page();
		if (page) page.close();
	});

	await page.goto('https://y2mate.nu/en-8u37/');
	await page.type('#video', 'https://www.youtube.com/watch?v=To4SWGZkEPk', { delay: 100 });
	const convertButton = await page.evaluateHandle(() => {
		const buttons = document.querySelectorAll("div > button");
		return Array.from(buttons).find(button => button.textContent.trim() === "Convert");
	});
	await convertButton.click({ delay: 200 });

	let title = 'No title';
	let href;
	try {
		await page.waitForFunction(() => {
			const buttons = document.querySelectorAll("div > button");
			return Array.from(buttons).some(button => button.textContent.trim() === "Download");
		}, { timeout: 15000 });

		// Récupérer le bouton après qu'il soit disponible
		const downloadButton = await page.evaluateHandle(() => {
			const buttons = document.querySelectorAll("div > button");
			return Array.from(buttons).find(button => button.textContent.trim() === "Download");
		});

		await downloadButton.click({ delay: 1000 });
		title = await page.$eval('form>div', div => div.textContent);
		console.log('Le bouton download est apparu, titre : ' + title);
		//await browser.close();
		return await interaction.editReply('OK');
	} catch (e) {
		await browser.close();
		console.error('Le bouton #download n\'est pas apparu dans le temps imparti');
		return await interaction.editReply('❌ Erreur, boutton de téléchargement non trouvé. Le site a sûrement bloqué le bot');
	}
};
