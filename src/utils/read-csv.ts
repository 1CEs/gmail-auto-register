import fs from 'fs';

interface CsvRow {
    [key: string]: string[];
}

export const readCsv = (path: string): CsvRow[] => {
    const csv = fs.readFileSync(path, 'utf8');
    const lines = csv.split(/[\r\n]+/).filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
        return [];
    }

    const headers = lines[0]?.split(',').map(header => header.trim()) ?? [];
    const result: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        
        const row: CsvRow = {};
        
        const values = line.split(',').map(value => value.trim());
        
        headers.forEach((header, index) => {
            if (values[index]) {
                row[header] = [...new Set(values[index].split(',').map(v => v.trim()))];
            } else {
                row[header] = [];
            }
        });
        
        result.push(row);
    }

    return result;
};



