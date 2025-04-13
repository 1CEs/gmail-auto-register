import { phoneCountry } from "../data/country";

export const randomPhone = async (code: keyof typeof phoneCountry): Promise<RandomPhone> => {
    while (true) {
        const country = phoneCountry[code];
        const phoneEndpoint = process.env.PHONE_API_ENDPOINT;
        if (!phoneEndpoint) {
            throw new Error("phone_API_ENDPOINT is not set");
        }

        const detailURL = `${phoneEndpoint}/${country}?country=${country}&ui=true&lang=en`
        const detailResponse = await fetch(detailURL);
        if (!detailResponse.ok) {
            throw new Error(`Failed to fetch phone data: ${detailResponse.statusText}`);
        }
        
        const data = await detailResponse.json() as any;
        if (!data || !data.numbers || !Array.isArray(data.numbers) || data.numbers.length === 0) {
            throw new Error("Invalid or empty phone numbers data received");
        }

        if (!data.code || !data.content || !data.content.country) {
            throw new Error("Missing required data fields in response");
        }

        const randomPhone = data.numbers[Math.floor(Math.random() * data.numbers.length)] as RandomPhone;
        if (!randomPhone) {
            throw new Error("Failed to get random phone number");
        }

        return {
            ...randomPhone,
            code: data.code,
            country: data.content.country,
            short: code.toLowerCase()
        };
    }
}

