import fs from 'node:fs';
import zlib from 'node:zlib';
import readline from 'node:readline';
import { PATHS } from './shared/paths.js';
import { writeReadableJson } from './shared/files.js';
import KeywordCanonBuilder from './keywordCanon/KeywordCanonBuilder.js';
import canonCard from './keywordCanon/canonCard.js';

const EXCLUDED_SET_TYPES = new Set([
    'funny', 'token', 'memorabilia', 'alchemy', 'minigame', 'vanguard', 'planechase',
    'archenemy', 'treasure_chest'
]);
const EXCLUDED_LAYOUTS = new Set([
    'token', 'double_faced_token', 'emblem', 'art_series', 'planar', 'scheme', 'vanguard'
]);

const [cardsPath] = process.argv.slice(2);

async function* jsonl(path) {
    const input = fs.createReadStream(path).pipe(zlib.createGunzip());
    const lines = readline.createInterface({ input, crlfDelay: Infinity });
    for await (const line of lines) if (line.trim()) yield JSON.parse(line);
}

function isCanonPrint(card) {
    if (card.digital || card.lang !== 'en') return false;
    return !EXCLUDED_SET_TYPES.has(card.set_type) && !EXCLUDED_LAYOUTS.has(card.layout);
}

const firstPrints = new Map();
for await (const card of jsonl(cardsPath)) {
    if (!isCanonPrint(card)) continue;
    const previous = firstPrints.get(card.oracle_id);
    if (previous && previous.released_at <= card.released_at) continue;
    firstPrints.set(card.oracle_id, card);
}

const builder = new KeywordCanonBuilder();
for (const card of firstPrints.values()) builder.addCard(canonCard(card));

const table = builder.build();
writeReadableJson(PATHS.keywordCanon, table);
console.log(`${firstPrints.size} cards, ${Object.keys(table).length} keyword abilities`);
