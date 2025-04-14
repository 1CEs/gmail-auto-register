import type { phoneCountry } from "./data/country";
import { delay } from "./utils/delay";
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
    try {
        let isError: any = null;
        while (isError == null || isError == true) {
            const domain = randomDomain();
            let browser: any = null;
            try {
                const proxy = await randomProxy();
                const getPhone = await randomPhone(proxy.code as keyof typeof phoneCountry);
                console.log({
                    phone: getPhone,
                    proxy: proxy
                })
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
                await delay(2000);
                const nameInput = await page.$$('.whsOnd');
                if (nameInput.length > 0) {
                    await nameInput[0]?.click();
                    await delay(1000);
                    await nameInput[0]?.type(domain.fullName.split(' ')[0]!);
                    await delay(1000);
                    await nameInput[1]?.click();
                    await delay(1000);
                    await nameInput[1]?.type(domain.fullName.split(' ')[1]!);
                }
                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await delay(2000);
                    await nextButton.click();
                }

                await page.waitForNavigation({ waitUntil: 'load' });

                // Second page
                await delay(2000);
                const monthSelector = await page.$$('#month');
                await monthSelector[0]?.click();
                await delay(1000);
                await monthSelector[0]?.select(randomMonth().toString());
                await delay(2000);
                const genderSelector = await page.$$('#gender');
                await genderSelector[0]?.click();
                await delay(1000);
                await genderSelector[0]?.select(randomGender().toString());
                await delay(2000);
                const dayInput = await page.$$('#day');
                await dayInput[0]?.click();
                await delay(1000);
                await dayInput[0]?.type(randomDay().toString());
                await delay(2000);
                const yearInput = await page.$$('#year');
                await yearInput[0]?.click();
                await delay(1000);
                await yearInput[0]?.type(randomYear().toString());

                nextButton = await page.$('.VfPpkd-vQzf8d');
                if (nextButton) {
                    await delay(2000);;
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
                        await delay(2000);;
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
                await gmailInput?.click();
                await delay(1000);
                await gmailInput?.type(domain.domain + randomDomain().fullName.toLocaleLowerCase().split(' ')[0]!);

                await delay(2000);
                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await delay(2000);
                    await nextButton.click();
                }

                let alreadyUsedElement = await page.$('.Ekjuhf')

                if (alreadyUsedElement) {
                    try {
                        console.log("Username already used")
                        let alreadyUsed = await alreadyUsedElement?.$eval('span', (el: any) => el.innerText);
                        if (alreadyUsed == "That username is taken. Try another.") {
                            await browser.close();
                            continue;
                        }
                    } catch (error) {
                        console.log("Error checking username availability, continuing...");
                        continue;
                    }
                }

                // Fourth page

                await page.waitForNavigation({ waitUntil: 'load' });

                await delay(2000);
                const passwordInput = await page.$$('.whsOnd');
                await delay(1000);
                await passwordInput[0]?.click();
                await delay(1000);
                await passwordInput[0]?.type(staticPassword);
                await delay(1000);
                await passwordInput[1]?.click();
                await delay(1000);
                await passwordInput[1]?.type(staticPassword);

                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    console.log("Clicking next button")
                    await delay(2000);
                    await nextButton.click();
                }

                // Fifth page
                await delay(3000);
                const errorSelectors = ['.TRKiX', '.dMNVAe'];
                const errorMessages = [
                    "Sorry, we could not create your Google Account.",
                ];
                let errorText: any = null;
                for (const selector of errorSelectors) {
                    try {
                        const errorDetector = await page.$(selector);
                        if (errorDetector) {
                            errorText = await errorDetector.evaluate((el: any) => el.innerText);
                            console.log(errorText)
                            if (errorMessages.includes(errorText)) {
                                console.log("Error detected")
                                isError = true;
                                await browser.close();
                            }
                        }
                    } catch (error) {
                        console.log(`Error checking selector ${selector}, continuing...`);
                        continue;
                    }
                }
                
                
                const selectorButton = await page.$$('.VfPpkd-aPP78e');
                await delay(1000);
                await selectorButton[0]?.click();
                

                await delay(2000);
                console.log(getPhone.short)
                const countryButton = await page.$$(`[data-value="${getPhone.short}"]`);
                await countryButton[0]?.click();

                await delay(1000);
                const phoneInput = await page.$$('#phoneNumberId');
                await phoneInput[0]?.type(getPhone.number);

                await delay(1000);
                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await delay(2000);;
                    await nextButton.click();
                }

                await delay(1000);
                const phoneError = await page.$('.Ekjuhf');
                if(phoneError) {
                    let phoneErrorText = await phoneError.evaluate((el: any) => el.innerText);
                    console.log(phoneErrorText)
                    if(
                        phoneErrorText == "This phone number cannot be used for verification." ||
                        phoneErrorText == "This phone number has been used too many times"
                    ) {
                        await browser.close();
                        continue;
                    }
                }

                // Sixth page
                let message: null | Message["data"][0] | undefined = null;
                let attempt: number = 0;
                while(attempt < 10) {
                    message = await getGoogleCode(getPhone);
                    if(message?.in_number === "Google") {
                        console.log(`Message from google ${message.in_number}`);
                        break;
                    }
                    attempt++;
                    console.log(`Tried to get google code ${attempt} times`);
                    await delay(3000);
                }
                
                if(attempt >= 10 || !message || message.in_number !== "Google") {
                    console.log("Failed to get Google verification code after 10 attempts");
                    await browser.close();
                    continue;
                }
                
                console.log(message);
                const code = message?.text.match(/\b\d{6}\b/)![0];
                console.log(`Google Code: ${code}`);
                await delay(2000);
                const codeInput = await page.$$('.whsOnd');
                await codeInput[0]?.type(code);

                await delay(1000)

                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await delay(2000);;
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
                    await delay(2000);;
                    await nextButton.click();
                }

                await delay(2000);

                const settingRadio = await page.$$('.zJKIV');
                settingRadio[0]?.click();

                await delay(1000);

                nextButton = await page.$('.VfPpkd-RLmnJb');
                if (nextButton) {
                    await delay(2000);;
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

                let accountsData = [];
                try {
                    const accounts = await fs.promises.readFile(savePath, 'utf8');
                    if (accounts.trim()) {
                        accountsData = JSON.parse(accounts);
                    }
                } catch (error) {
                    // If file doesn't exist or is empty, start with empty array
                    accountsData = [];
                }

                accountsData.push({
                    ...getPhone,
                    email: domain.domain + randomDomain().fullName.toLocaleLowerCase().split(' ')[0]!,
                    password: staticPassword
                });

                await fs.promises.writeFile('accounts.json', JSON.stringify(accountsData, null, 2));
                console.log(`Account saved: ${accountsData.length}`)
                isError = false
            } catch (error) {
                console.error(`Error detected try to restart.`, error);
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