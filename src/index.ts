
import { delay, randomDelay } from "./utils/delay";
import { randomDomain } from "./utils/random-domain";
import { randomMonth, randomGender, randomDay, randomYear } from "./utils/random-information";
import { randomProxy } from "./utils/random-proxy";
import { randomUserAgent } from "./utils/random-user-agent";
import puppeteer from "puppeteer";

(async () => main())();

async function main() {
    try {
        let isError: any = null;
        while (isError == null || isError == true) {
            const proxy = await randomProxy();
            const browser = await puppeteer.launch({
                headless: false,
                args: [`--proxy-server=${proxy.proxy}`]
            });
            let nextButton: any = null;
            const baseURL = process.env.GOOGLE_V2_URL;
            const staticPassword = process.env.STATIC_PASSWORD;

            if (!baseURL) {
                throw new Error("BASE_URL is not set");
            }

            if (!staticPassword) {
                throw new Error("STATIC_PASSWORD is not set");
            }

            const page = await browser.newPage();
            await page.authenticate({
                username: proxy.username,
                password: proxy.password
            })

            page.setUserAgent(randomUserAgent().useragent[0] as string)
            await page.goto(baseURL);

            await delay(3000);

            // For Google v3
            // const gotoButton = await page.$$('.h-c-header__cta-li-link');
            // await gotoButton[0]?.click();

            // await page.waitForNavigation({ waitUntil: 'load' });

            // const createButton = await page.$$('.VfPpkd-vQzf8d');
            // await createButton[2]?.click();

            // const selectorButton = await page.$$('.gNVsKb');
            // await selectorButton[0]?.click();

            // await page.waitForNavigation({ waitUntil: 'load' });

            // Firt page
            const nameInput = await page.$$('.whsOnd');
            const domain = randomDomain()
            if (nameInput.length > 0) {
                await nameInput[0]?.type(domain.fullName.split(' ')[0]!);
                await randomDelay();
                await nameInput[1]?.type(domain.fullName.split(' ')[1]!);
            }
            nextButton = await page.$('.VfPpkd-RLmnJb');
            if (nextButton) {
                await randomDelay();
                await nextButton.click();
            }

            await page.waitForNavigation({ waitUntil: 'load' });

            // Second page
            await delay(2000);
            const monthSelector = await page.$$('#month');
            await monthSelector[0]?.select(randomMonth().toString());
            await randomDelay();
            const genderSelector = await page.$$('#gender');
            await genderSelector[0]?.select(randomGender().toString());
            await randomDelay();
            const dayInput = await page.$$('#day');
            await dayInput[0]?.type(randomDay().toString());
            await randomDelay();
            const yearInput = await page.$$('#year');
            await yearInput[0]?.type(randomYear().toString());

            nextButton = await page.$('.VfPpkd-vQzf8d');
            if (nextButton) {
                await randomDelay();
                await nextButton.click();
            }

            await page.waitForNavigation({ waitUntil: 'load' });

            // Third page
            await delay(2000);
            const createRadio = await page.$$('.zJKIV');
            if (createRadio.length == 2) {
                await createRadio[0]?.click();
                delay(1000);
                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await randomDelay();
                    await nextButton.click();
                }
                await delay(2000);
                const newCreateRadio = await page.$$('.zJKIV');
                await newCreateRadio[2]?.click();

            } else {
                await createRadio[2]?.click();
                await delay(2000);
                const gmailInput = await page.$('.whsOnd');
                await gmailInput?.type(domain.domain + randomDomain().fullName.toLocaleLowerCase().split(' ')[0]!);

                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await randomDelay();
                    await nextButton.click();
                }

                
            }

            await delay(2000);
            let alreadyUsedElement = await page.$('.Ekjuhf')

            if (alreadyUsedElement) {
                let alreadyUsed = await alreadyUsedElement?.$eval('span', (el: any) => el.innerText);
                if (alreadyUsed == "That username is taken. Try another.") {
                    await browser.close();
                    continue;
                }
            }

            // Fourth page
            await page.waitForSelector('.whsOnd');
            await delay(4000);
            const passwordInput = await page.$$('.whsOnd');
            await passwordInput[0]?.type(staticPassword);
            await delay(1000);
            await passwordInput[1]?.type(staticPassword);

            nextButton = await page.$('.VfPpkd-RLmnJb');
            if (nextButton) {
                await randomDelay();
                await nextButton.click();
            }

            await page.waitForNavigation({ waitUntil: 'load' });

            // Fifth page
            await delay(2000);

            const errorDetector = await page.$('.TRKiX');

            if (errorDetector) {
                const errorText = await errorDetector.$eval('span', (el: any) => el.innerText);
                console.log(errorText);
                isError = true;
                await browser.close();
                continue;
            }

            isError = false
        }
    } catch (error) {
        console.log(error)
    }
}