import type { phoneCountry } from "./data/country";
import { delay, randomDelay } from "./utils/delay";
import { getGoogleCode } from "./utils/get-google-code";
import { randomDomain } from "./utils/random-domain";
import { randomMonth, randomGender, randomDay, randomYear } from "./utils/random-information";
import { randomPhone } from "./utils/random-phone";
import { randomProxy } from "./utils/random-proxy";
import { randomUserAgent } from "./utils/random-user-agent";
import puppeteer from "puppeteer";
import fs from 'fs'

(async () => main())();

async function main() {
    let runningTime: number = 0;
    try {
        runningTime++;
        let isError: any = null;
        while (isError == null || isError == true) {
            let browser: any = null;
            try {
                const proxy = await randomProxy();
                const getPhone = await randomPhone(proxy.code as keyof typeof phoneCountry);
                browser = await puppeteer.launch({
                    headless: false,
                    args: [`--proxy-server=${proxy.proxy}`]
                });
                let nextButton: any = null;
                const baseURL = process.env.GOOGLE_V2_URL;
                const staticPassword = process.env.STATIC_PASSWORD;
                const recoveryEmail = process.env.RECOVERY_EMAIL;

                if (!recoveryEmail) {
                    throw new Error("RECOVERY_EMAIL is not set");
                }

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
                await page.goto(baseURL, { waitUntil: "networkidle0" });

                await delay(2000);

                const isNoInternet = await page.$('.neterror');
                if (isNoInternet) {
                    await browser.close();
                    continue;
                }

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
                    delay(2000);
                    await createRadio[0]?.click();
                    nextButton = await page.$('.VfPpkd-RLmnJb');
                    if (nextButton) {
                        await randomDelay();
                        await nextButton.click();
                    }
                    await delay(2000);
                    const newCreateRadio = await page.$$('.zJKIV');
                    await newCreateRadio[2]?.click();

                } else {
                    await delay(2000);
                    await createRadio[2]?.click();
                }

                await delay(1000);

                const gmailInput = await page.$('.whsOnd');
                await gmailInput?.type(domain.domain + randomDomain().fullName.toLocaleLowerCase().split(' ')[0]!);

                await delay(2000);
                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await randomDelay();
                    await nextButton.click();
                }

                let alreadyUsedElement = await page.$('.Ekjuhf')

                if (alreadyUsedElement) {
                    let alreadyUsed = await alreadyUsedElement?.$eval('span', (el: any) => el.innerText);
                    if (alreadyUsed == "That username is taken. Try another.") {
                        await browser.close();
                        continue;
                    }
                }

                // Fourth page
                await delay(2000);
                const passwordInput = await page.$$('.whsOnd');
                await delay(2000);
                await passwordInput[0]?.type(staticPassword);
                await delay(2000);
                await passwordInput[1]?.type(staticPassword);

                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await randomDelay();
                    await nextButton.click();
                }

                // Fifth page
                await delay(2000);
                const errorSelectors = ['.TRKiX', '.dMNVAe'];
                const errorMessages = [
                    "Sorry, we could not create your Google Account.",
                    "To continue, scan the QR code with your phone. You will then use your phone to continue the verification process."
                ];
                let errorText: any = null;
                for (const selector of errorSelectors) {
                    const errorDetector = await page.$(selector);
                    if (errorDetector) {
                        errorText = await errorDetector.evaluate((el: any) => el.innerText);
                        console.log(errorText)
                        if (errorMessages.includes(errorText)) {
                            isError = true;
                            await browser.close();
                        }
                    }
                    
                }
                if(isError) continue
                await delay(2000);
                
                const selectorButton = await page.$$('.VfPpkd-aPP78e');
                await selectorButton[0]?.click();
                

                await delay(2000);
                const countryButton = await page.$$(`[data-value="${getPhone.short}"]`);
                await countryButton[0]?.click();

                await delay(1000);
                const phoneInput = await page.$$('#phoneNumberId');
                await phoneInput[0]?.type(getPhone.number);

                await delay(1000);
                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await randomDelay();
                    await nextButton.click();
                }

                await delay(1000);
                const phoneError = await page.$('.Ekjuhf');
                if(phoneError) {
                    let phoneErrorText = await phoneError.evaluate((el: any) => el.innerText);
                    console.log(phoneErrorText)
                    if(phoneErrorText == "This phone number cannot be used for verification.") {
                        await browser.close();
                        continue;
                    }
                }

                // Sixth page
                let message: null | Message["data"][0] | undefined = null;
                let attempt: number = 0;
                while(message == null) {
                    message = await getGoogleCode(getPhone)
                    if(message?.in_number === "Google") {
                        break;
                    }
                    attempt++
                    if(attempt > 10) {
                        await browser.close();
                        continue;
                    }
                    console.log(`Tried to get google code ${attempt} times`)
                    await delay(3000)
                }
                const code = message?.text.match(/\b\d{6}\b/)![0];
                console.log(`Google Code: ${code}`)
                await delay(2000);
                const codeInput = await page.$$('.whsOnd');
                await codeInput[0]?.type(code);

                await delay(1000)

                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await randomDelay();
                    await nextButton.click();
                }

                await delay(2000);

                const skipRecoveryButton = await page.$$('.VfPpkd-LgbsSe');
                skipRecoveryButton[0]?.click();

                await delay(2000);

                const skipPhoneButton = await page.$$('.VfPpkd-RLmnJb');
                skipPhoneButton[0]?.click();

                await delay(2000);

                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await randomDelay();
                    await nextButton.click();
                }

                await delay(2000);

                const settingRadio = await page.$$('.zJKIV');
                settingRadio[0]?.click();

                await delay(1000);

                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await randomDelay();
                    await nextButton.click();
                }

                await delay(2000);

                const acceptAllButton = await page.$$('.VfPpkd-RLmnJb');
                acceptAllButton[0]?.click();

                await delay(2000);
                const confirmButton = await page.$$('.VfPpkd-RLmnJb');
                confirmButton[0]?.click();

                await delay(2000);

                const agreeButton = await page.$$('.VfPpkd-RLmnJb');
                agreeButton[0]?.click();

                await delay(2000);

                const savePath = process.env.SAVE_PATH;
                if(!savePath) {
                    throw new Error("SAVE_PATH is not set");
                }

                const acisError = true;counts = await fs.promises.readFile(savePath, 'utf8');
                const accountsData = JSON.parse(accounts);
                accountsData.push({
                    ...getPhone,
                    email: domain.domain + randomDomain().fullName.toLocaleLowerCase().split(' ')[0]!,
                    password: staticPassword
                });

                await fs.promises.writeFile('accounts.json', JSON.stringify(accountsData, null, 2));
                console.log(`Account saved: ${accountsData.length}`)
                isError = false
            } catch (error) {
                console.error(`Error detected try to restart: ${runningTime}`);
                isError = true;
            } finally {
                try {
                    if (browser) {
                        await browser.close();
                    }
                } catch (browserError) {
                    isError = true;
                    console.error('Error closing browser:', browserError);
                }
            }
        }
    } catch (error) {
        console.error('Fatal error:', error);
    }
}