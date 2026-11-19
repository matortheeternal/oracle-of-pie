import { readJson, writeJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import { createCorpusScribe, cardKey } from './corpus/corpusScribe.js';
import tagCard from './corpus/tagCard.js';
import { emptyCoverage, addCoverage } from './corpus/eventCoverage.js';

const [corpusPath = PATHS.corpus, outPath = PATHS.predictions] = process.argv.slice(2);
const corpus = readJson(corpusPath);
const scribe = createCorpusScribe(corpus);

function failedResult(error) {
    return { tags: {}, recognized: false, unrecognized: [], error: error.message };
}

function totalEvents(results) {
    const total = emptyCoverage();
    for (const result of results) addCoverage(total, result.events ?? {});
    return total;
}

const started = Date.now();
const results = {};
const failures = [];
for (const card of corpus) {
    try {
        results[cardKey(card)] = tagCard(scribe, card);
    } catch (error) {
        failures.push({ name: card.name, error: error.message });
        results[cardKey(card)] = failedResult(error);
    }
}
writeJson(outPath, results);
const values = Object.values(results);
console.log(JSON.stringify({
    cards: corpus.length,
    recognized: values.filter(result => result.recognized).length,
    failures: failures.length,
    triggerEvents: totalEvents(values),
    ms: Date.now() - started
}));
for (const failure of failures.slice(0, 10))
    console.log('FAIL', failure.name, failure.error);
