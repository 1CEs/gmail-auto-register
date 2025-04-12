import puppeteer from "puppeteer";
import { getRandomProxy } from "./utils/random-proxy";
import { delay } from "./utils/delay";

(async() => main())();

async function main() {
    const proxy = await getRandomProxy();
    const browser = await puppeteer.launch({ headless: false, args: [`--proxy-server=${proxy}`] });
    try {
        const page = await browser.newPage();
        await page.goto("https://www.google.com");
        await delay(5000);
    } catch (error) {
        
    } finally {
        await browser.close();
    }
}