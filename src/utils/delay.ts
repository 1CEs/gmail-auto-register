const randomDelay = () => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000)));
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export { randomDelay, delay };
