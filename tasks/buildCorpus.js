import fs from 'node:fs';
import zlib from 'node:zlib';
import readline from 'node:readline';
import Sifter from 'sigil-sifter';
import Magic from '@sigil-sifter/magic';
import ScryfallCard from '@sigil-sifter/magic-scryfall';
import { DATA } from './shared/paths.js';

const [cardsPath, tagsPath, outDir = DATA, since = '2016-01-01'] = process.argv.slice(2);
const EXCLUDED_TYPES = [
    'token', 'basic', 'emblem', 'conspiracy', 'scheme', 'plane', 'phenomenon',
    'vanguard', 'dungeon', 'stickers', '/\\bcard\\b/'
];
const QUERY = [
    'game:paper', '-is:promo', '-st:funny', '-st:memorabilia', '-st:token',
    '-st:minigame',
    ...EXCLUDED_TYPES.map(type => `-t:${type}`)
].join(' ');
const STANDARD_SET_TYPES = new Set(['expansion', 'core']);
const NOVELTY_BORDERS = new Set(['silver']);
const NOVELTY_STAMPS = new Set(['acorn']);
const NOVELTY_PROMOS = new Set(['playtest']);

function isNoveltyPrint(card) {
    if (NOVELTY_BORDERS.has(card.border_color)) return true;
    if (NOVELTY_STAMPS.has(card.security_stamp)) return true;
    return (card.promo_types ?? []).some(type => NOVELTY_PROMOS.has(type));
}

function isModernPrint(card) {
    if (card.released_at < since) return false;
    if (isNoveltyPrint(card)) return false;
    return !card.reprint || STANDARD_SET_TYPES.has(card.set_type);
}

async function* jsonl(path) {
    const input = fs.createReadStream(path).pipe(zlib.createGunzip());
    const lines = readline.createInterface({ input, crlfDelay: Infinity });
    for await (const line of lines) if (line.trim()) yield JSON.parse(line);
}

const tagsByOracle = new Map();
const tagInfo = {};

function addTagging(oracleId, slug) {
    if (!tagsByOracle.has(oracleId)) tagsByOracle.set(oracleId, []);
    tagsByOracle.get(oracleId).push(slug);
}

function describeTag(tag) {
    return {
        id: tag.id,
        parents: tag.parent_ids,
        aliases: tag.aliases,
        description: tag.description,
        count: tag.taggings.length
    };
}

for await (const tag of jsonl(tagsPath)) {
    tagInfo[tag.slug] = describeTag(tag);
    for (const { oracle_id } of tag.taggings) addTagging(oracle_id, tag.slug);
}

class TaggedCard extends ScryfallCard {
    get tags() {
        return tagsByOracle.get(this.card.oracle_id) ?? [];
    }
}

const sifter = new Sifter();
Magic(sifter, TaggedCard);

const candidates = [];
let total = 0;
fs.mkdirSync(outDir, { recursive: true });
for await (const card of jsonl(cardsPath)) {
    total++;
    if (isModernPrint(card)) candidates.push(card);
}
const sifterStart = Date.now();
const matched = sifter.filter(candidates, QUERY);
const sifterMs = Date.now() - sifterStart;

function isEarlierPrint(card, previous) {
    return !previous || card.released_at < previous.released_at;
}

const firstPrint = new Map();
for (const card of matched) {
    if (isEarlierPrint(card, firstPrint.get(card.oracle_id)))
        firstPrint.set(card.oracle_id, card);
}

function faces(card) {
    return card.card_faces ?? [card];
}

function describeFace(face) {
    return {
        name: face.name,
        type_line: face.type_line,
        mana_cost: face.mana_cost,
        colors: face.colors,
        oracle_text: face.oracle_text ?? ''
    };
}

function cardColors(card) {
    return card.colors ?? [...new Set(faces(card).flatMap(face => face.colors ?? []))];
}

function describeCard(card) {
    return {
        oracle_id: card.oracle_id,
        name: card.name,
        released_at: card.released_at,
        set: card.set,
        rarity: card.rarity,
        colors: cardColors(card),
        color_identity: card.color_identity,
        mana_cost: faces(card).map(face => face.mana_cost ?? '').join(' // '),
        type_line: card.type_line,
        layout: card.layout,
        keywords: card.keywords,
        scryfall_uri: card.scryfall_uri,
        image: card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal,
        faces: faces(card).map(describeFace),
        tags: tagsByOracle.get(card.oracle_id) ?? []
    };
}

const out = [...firstPrint.values()].map(describeCard);
fs.writeFileSync(`${outDir}/corpus.json`, JSON.stringify(out));
fs.writeFileSync(`${outDir}/tags.json`, JSON.stringify(tagInfo));
console.log({
    total,
    sinceDate: candidates.length,
    matched: matched.length,
    unique: out.length,
    sifterMs,
    tagged: out.filter(card => card.tags.length).length,
    tagCount: Object.keys(tagInfo).length
});
