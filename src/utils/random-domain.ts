import { readCsv } from "./read-csv";

export const randomDomain = (): RandomDomain => {
    const uniNicknames = readCsv('./src/data/uni-nickname.csv');
    const thaiNicknames = readCsv('./src/data/thai-nickname.csv');
    
    const randomUniNickname = uniNicknames[Math.floor(Math.random() * uniNicknames.length)];
    const randomThaiNickname = thaiNicknames[Math.floor(Math.random() * thaiNicknames.length)];
    
    if (!randomUniNickname || !randomThaiNickname || 
        !randomUniNickname.nickname || !randomThaiNickname.en) {
        throw new Error('Failed to get random nicknames');
    }
    
    const uniNicknameVariations = randomUniNickname.nickname;
    if (uniNicknameVariations.length === 0) {
        throw new Error('No nickname variations found');
    }
    
    const randomUniVariation = uniNicknameVariations[Math.floor(Math.random() * uniNicknameVariations.length)];
    if (!randomUniVariation) {
        throw new Error('Failed to get random nickname variation');
    }
    
    const thaiNickname = randomThaiNickname.en[0];
    if (!thaiNickname) {
        throw new Error('Failed to get Thai nickname');
    }
    
    return {
        domain: `${randomUniVariation.toLowerCase()}${thaiNickname.toLowerCase()}@gmail.com`,
        fullName: `${thaiNickname} ${randomUniVariation}`
    }
};

