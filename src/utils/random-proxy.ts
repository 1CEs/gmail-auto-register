import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

interface Proxy {
  ip: string;
  port: string;
}

export function getRandomProxy(): Promise<string> {
  return new Promise((resolve, reject) => {
    const proxies: Proxy[] = [];
    fs.createReadStream(path.join(__dirname, '../data/proxies.csv'))
      .pipe(csvParser())
      .on('data', (row) => {
        proxies.push({
          ip: row.ip,
          port: row.port
        });
      })
      .on('end', () => {
        if (proxies.length === 0) {
          reject(new Error('No proxies found in the CSV file'));
          return;
        }
        
        const randomIndex = Math.floor(Math.random() * proxies.length);
        resolve(`${proxies[randomIndex]?.ip}:${proxies[randomIndex]?.port}`);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}


console.log(await getRandomProxy());