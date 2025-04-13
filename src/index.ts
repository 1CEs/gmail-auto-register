import puppeteer from "puppeteer";
import { getRandomProxy } from "./utils/random-proxy";
import { randomDelay } from "./utils/delay";
import { randomDomain } from "./utils/random-domain";

(async() => main())();

async function main() {
    const browser = await puppeteer.launch({ 
        headless: false, 
    });
    try {
        const baseURL = process.env.BASE_URL;

        if (!baseURL) {
            throw new Error("BASE_URL is not set");
        }

        const page = await browser.newPage();
        await page.goto(baseURL);

        // Firt page
        const nameInput = await page.$$('.whsOnd');
        const domain = randomDomain()
        if(nameInput.length > 0) {
            await nameInput[0]?.type(domain.fullName.split(' ')[0]!);
            await randomDelay();
            await nameInput[1]?.type(domain.fullName.split(' ')[1]!);
        }
        const nextButton = await page.$('.VfPpkd-RLmnJb');
        if(nextButton) {
            await randomDelay();
            await nextButton.click();
        }

        // Second page
        const selectInput = await page.$$('KfeUId');
        if(selectInput.length > 0) {
            await selectInput[0]?.select("");
        }

        // await delay(5000);
    } catch (error) {
        
    } finally {
        // await browser.close();
    }
}