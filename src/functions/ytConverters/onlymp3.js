const fs = require('node:fs');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const puppeteer = require('puppeteer');


module.exports = async function (link, interaction) {

	// Puppeteer navigation to get dowload link from YT to mp3 converter
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, 'webdriver', { get: () => false });
	});

	browser.on("targetcreated", async (target) => {
		const page = await target.page();
		if (page) page.close();
	});

	await page.goto('https://fr.onlymp3.co/2/');
	await page.type('#txtUrl', link, { delay: 20 });
	await page.click('#btnSubmit', { delay: 20 });

	let title = 'No title';
	let dataUrl;
	try {
		await page.waitForFunction(() => {
			const buttons = document.querySelectorAll("td>button.btn");
			return Array.from(buttons).some(button => button.textContent.trim() === "Download");
		}, { timeout: 30000 });
		dataUrl = await page.$eval('td>button.btn', btn => btn.getAttribute('data-url'));
		title = await page.$eval('span.vidTitle', span => span.textContent.replace('Title: ', '').trim());
		console.log('Le bouton download est apparu');
		await browser.close();
	} catch (e) {
		await browser.close();
		console.error('Le bouton download n\'est pas apparu dans le temps imparti');
		return await interaction.editReply('❌ Erreur, boutton de téléchargement non trouvé. Le site a sûrement bloqué le bot');
	}

	// Downloading with fetch the music file, with the link obtained before
	try {
		const response = await fetch(dataUrl);
		if (!response.ok) throw new Error(`Erreur lors du téléchargement: ${response.statusText}`);

		const writeStream = fs.createWriteStream(`./music-files/${title}.mp3`);
		await finished(Readable.fromWeb(response.body).pipe(writeStream));
		console.log('Musique téléchargé !');
		return title;
	} catch (error) {
		console.error(error);
		return await interaction.editReply('❌ Erreur lors du téléchargement de la musique');
	}
};
