import fs from 'fs';
import path from 'path';

export function getRandomProxy() {
  const proxies = fs.readFileSync(path.join(__dirname, '../data/proxies.txt'), 'utf8').split('\n');
  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
  return randomProxy;
};