import fs from 'node:fs';
import path from 'node:path';

export function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value));
}

export function readJsonl(file) {
    if (!fs.existsSync(file)) return [];
    const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
    return lines.map(line => JSON.parse(line));
}

export function writeJsonl(file, values) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, values.map(value => JSON.stringify(value) + '\n').join(''));
}
