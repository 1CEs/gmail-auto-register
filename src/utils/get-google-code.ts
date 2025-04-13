import { randomPhone } from "./random-phone";

export const getGoogleCode = async (phone: RandomPhone) => {
    const phoneEndpoint = process.env.phone_API_ENDPOINT;
    const countMessage = process.env.COUNT_MESSAGE;

    if (!phoneEndpoint) {
        throw new Error("phone_API_ENDPOINT is not set");
    }

    if (!countMessage) {
        throw new Error("COUNT_MESSAGE is not set");
    }

    const phoneNumber = phone.code + phone.number;

    const detailURL = `${phoneEndpoint}/${phone.country}/${phoneNumber}?page=1&count=${countMessage}&ui=true&lang=en`
    const detailResponse = await fetch(detailURL);
    const data = await detailResponse.json() as any;
    const messages = data.messages as Message;
    console.log(messages.data[0])
}

await getGoogleCode(await randomPhone())