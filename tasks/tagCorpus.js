import { readJson, writeJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import { createCorpusScribe, cardKey } from './corpus/corpusScribe.js';
import tagCard from './corpus/tagCard.js';
import TagTree from './tags/TagTree.js';

const [corpusPath = PATHS.corpus, outPath = PATHS.predictions] = process.argv.slice(2);
const corpus = readJson(corpusPath);
const scribe = createCorpusScribe(corpus);
const tree = TagTree.load(PATHS.tags);

function failedResult(error) {
    return { tags: {}, recognized: false, unrecognized: [], error: error.message };
}

const started = Date.now();
const results = {};
const failures = [];
for (const card of corpus) {
    try {
        results[cardKey(card)] = tagCard(scribe, card, tree.withAncestors(card.tags));
    } catch (error) {
        failures.push({ name: card.name, error: error.message });
        results[cardKey(card)] = failedResult(error);
    }
}
writeJson(outPath, results);
const recognized = Object.values(results).filter(result => result.recognized).length;
console.log(JSON.stringify({
    cards: corpus.length,
    recognized,
    failures: failures.length,
    ms: Date.now() - started
}));
for (const failure of failures.slice(0, 10))
    console.log('FAIL', failure.name, failure.error);
