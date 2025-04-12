import puppeteer from "puppeteer";
import { getRandomProxy } from "./utils/random-proxy";
import { delay } from "./utils/delay";

(async() => main())();

async function main() {
    const proxy = await getRandomProxy();
    const browser = await puppeteer.launch({ headless: false });
    try {
        const baseURL = process.env.BASE_URL;

        if (!baseURL) {
            throw new Error("BASE_URL is not set");
        }

        const page = await browser.newPage();
        await page.goto(baseURL);
        // await delay(5000);
    } catch (error) {
        
    } finally {
        // await browser.close();
    }
}