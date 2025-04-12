import { readCsv } from "./read-csv";

export const randomUserAgent = () => {
    const userAgents = readCsv('./src/data/user-agents.csv');
    return userAgents[Math.floor(Math.random() * userAgents.length)];
};


console.log(randomUserAgent());
