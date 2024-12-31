import fs from 'node:fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import puppeteer from 'puppeteer';
import { ChatInputCommandInteraction } from 'discord.js';


export default async function (link: string, interaction: ChatInputCommandInteraction): Promise<string | undefined> {

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

	await page.goto('https://fr.onlymp3.co/2/');
	await page.type('#txtUrl', link, { delay: 20 });
	await page.click('#btnSubmit', { delay: 20 });

	let title;
	let dataUrl;
	try {
		await page.waitForFunction(() => {
			const buttons = document.querySelectorAll("td>button.btn");
			return Array.from(buttons).some(button => button.textContent?.trim() === "Download");
		}, { timeout: 30000 });
		dataUrl = await page.$eval('td>button.btn', btn => btn.getAttribute('data-url'));
		title = await page.$eval('span.vidTitle', span => span.textContent?.replace(/Title: |Titre: /i, '').trim());
		console.log('Le bouton download est apparu');
		await browser.close();
	} catch (e) {
		await browser.close();
		console.error('Le bouton download n\'est pas apparu dans le temps imparti');
		return;
	}

	// Downloading with fetch the music file, with the link obtained before
	try {
		if (!dataUrl) throw new Error(`Erreur lors de la récupération du lien: ${dataUrl}`);
		const response = await fetch(dataUrl);
		if (!response.ok) throw new Error(`Erreur lors du téléchargement: ${response.statusText}`);

		const writeStream = fs.createWriteStream(`./music-files/${title}.mp3`);
		if (!response.body) throw new Error(`Erreur lors du téléchargement: ${response.statusText}`);
		await finished(Readable.from(response.body).pipe(writeStream));
		console.log('Musique téléchargé !');
		if (!title) title = 'No title.mp3';
		return title;
	} catch (error) {
		console.error(error);
		return;
	}
}
