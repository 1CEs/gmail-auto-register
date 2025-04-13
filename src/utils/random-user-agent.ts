import { readCsv } from "./read-csv";

export const randomUserAgent = (): RandomUserAgent => {
    const userAgents = readCsv('./src/data/user-agents.csv');
    return userAgents[Math.floor(Math.random() * userAgents.length)] as RandomUserAgent;
};
