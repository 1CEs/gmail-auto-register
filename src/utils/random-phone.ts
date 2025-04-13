import { phoneCountry } from "../data/country";

export const randomPhone = async (): Promise<RandomPhone> => {
    while (true) {
        const randomCountry = phoneCountry[Math.floor(Math.random() * phoneCountry.length)];
        const phoneEndpoint = process.env.PHONE_API_ENDPOINT;
        if (!phoneEndpoint) {
            throw new Error("phone_API_ENDPOINT is not set");
        }

        const detailURL = `${phoneEndpoint}/${randomCountry}?country=${randomCountry}&ui=true&lang=en`
        const detailResponse = await fetch(detailURL);
        const data = await detailResponse.json() as any;
        if (data.numbers.length == 0) {
            continue;
        }
        const randomPhone = data.numbers[Math.floor(Math.random() * data.numbers.length)] as RandomPhone;
        return {...randomPhone, code: data.code, country: data.content.country}
    }
}

