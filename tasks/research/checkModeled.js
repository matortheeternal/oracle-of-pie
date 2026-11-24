import { readJson } from '../shared/files.js';
import { PATHS } from '../shared/paths.js';
import { createCorpusScribe, cardKey } from '../corpus/corpusScribe.js';
import { parseCardFaces } from '../corpus/pieCorpus.js';
import MtgishAdapter from './MtgishAdapter.js';
import { MTGISH_CONCEPTS } from './mtgishConcepts.js';

const USAGE = 'Usage: node tasks/research/checkModeled.js BASELINE MTGISH_JSONL';
const [baselinePath, mtgishPath] = process.argv.slice(2);
if (!mtgishPath) throw new Error(USAGE);

const corpus = readJson(PATHS.corpus);
const before = readJson(baselinePath).predictions;
const after = readJson(PATHS.predictions);
const scribe = createCorpusScribe(corpus);
const adapter = new MtgishAdapter(mtgishPath);
const result = { newlyModeled: 0, unavailable: [], agree: {}, disagree: [] };

function isNewlyModeled(card) {
    const key = cardKey(card);
    return after[key]?.modeled && !before[key]?.modeled;
}

function ourConcepts(card) {
    const found = new Set();
    for (const face of parseCardFaces(scribe, card))
        for (const [node] of face.parsed.text.walk()) addConcepts(node, found);
    return found;
}

function addConcepts(node, found) {
    for (const concept of MTGISH_CONCEPTS)
        if (concept.ours(node)) found.add(concept.name);
}

function theirConcepts(encoded) {
    const text = JSON.stringify(encoded);
    return new Set(MTGISH_CONCEPTS.filter(c => c.theirs.test(text)).map(c => c.name));
}

function compareConcept(card, name, ours, theirs) {
    if (ours.has(name) === theirs.has(name)) {
        result.agree[name] = (result.agree[name] ?? 0) + Number(ours.has(name));
        return;
    }
    const side = ours.has(name) ? 'only ours' : 'only mtgish';
    result.disagree.push(`${card.name}: ${name} (${side})`);
}

function checkCard(card) {
    result.newlyModeled++;
    const encoded = adapter.lookup(card);
    if (!encoded) return result.unavailable.push(card.name);
    const ours = ourConcepts(card);
    const theirs = theirConcepts(encoded);
    for (const { name } of MTGISH_CONCEPTS) compareConcept(card, name, ours, theirs);
}

for (const card of corpus.filter(isNewlyModeled)) checkCard(card);
console.log(JSON.stringify(result, null, 2));
