import fs from 'node:fs';
import RulesScribe from '../src/index.js';

const [corpusPath, outPath] = process.argv.slice(2);
const corpus = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
const keywords = [...new Set(corpus.flatMap(card => card.keywords ?? []))];
const scribe = new RulesScribe({ keywords: [...keywords, 'Enchant', 'Equip'] });

function cardKey(card) {
    return card.oracle_id || card.name;
}

function parseCard(card) {
    const faces = card.faces.map(face => scribe.parseFace({
        name: face.name,
        typeLine: face.type_line ?? card.type_line ?? '',
        text: face.oracle_text ?? ''
    }));
    const tags = {};
    for (const face of faces)
        for (const [tag, evidence] of face.tags) tags[tag] ??= evidence;
    return {
        tags,
        recognized: faces.every(face => face.isFullyRecognized),
        unrecognized: faces.flatMap(face => face.unrecognized),
        opaque: faces.flatMap(face => face.opaque).length
    };
}

const started = Date.now();
const results = {};
const failures = [];
for (const card of corpus) {
    try {
        results[cardKey(card)] = parseCard(card);
    } catch (error) {
        failures.push({ name: card.name, error: error.message });
        results[cardKey(card)] = {
            tags: {},
            recognized: false,
            unrecognized: [],
            error: error.message
        };
    }
}
fs.writeFileSync(outPath, JSON.stringify(results));
const recognized = Object.values(results).filter(result => result.recognized).length;
console.log(JSON.stringify({
    cards: corpus.length,
    recognized,
    failures: failures.length,
    ms: Date.now() - started
}));
for (const failure of failures.slice(0, 10))
    console.log('FAIL', failure.name, failure.error);
