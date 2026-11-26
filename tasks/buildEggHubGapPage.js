import fs from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { DATA } from './shared/paths.js';
import GapIndex from './egghub/viewer/GapIndex.js';

const SOURCE = path.join(DATA, 'egghub-gap-entries.jsonl');
const CORPUS = path.join(DATA, 'egghub-corpus.jsonl');
const OUTPUT = path.join(DATA, 'egghub-gaps.html');
const VIEWER = fileURLToPath(new URL('./egghub/viewer/', import.meta.url));
const UNSAFE_HTML = /</g;

function readTemplate(name) {
    return fs.readFileSync(path.join(VIEWER, name), 'utf8');
}

function catalogJson(catalog) {
    return JSON.stringify(catalog).replace(UNSAFE_HTML, '\\u003c');
}

function readLines(file) {
    return createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
}

function dataScript(id, data) {
    return `<script type="application/octet-stream" id="shard-${id}">${data}</script>`;
}

if (!fs.existsSync(SOURCE) || !fs.existsSync(CORPUS))
    throw new Error('Run npm run egghub:audit to generate the corpus and gap entries.');

const index = new GapIndex();
for await (const line of readLines(CORPUS)) index.addCard(JSON.parse(line).id);
for await (const line of readLines(SOURCE)) index.add(JSON.parse(line));

const catalog = [];
const shards = [];
for (const { data, ...author } of index.pack()) {
    shards.push(dataScript(catalog.length, data));
    catalog.push(author);
}
const html = readTemplate('index.html')
    .replace('/* VIEWER_STYLE */', () => readTemplate('viewer.css'))
    .replace('/* VIEWER_SCRIPT */', () => readTemplate('viewer.js'))
    .replace('<!-- VIEWER_DATA -->', () => shards.join('\n'))
    .replace('/* VIEWER_CATALOG */', () => catalogJson(catalog));

fs.writeFileSync(OUTPUT, html);
console.log(OUTPUT);
