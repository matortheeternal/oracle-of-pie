import { readJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import { cardKey } from './corpus/corpusScribe.js';
import TagScore from './tags/TagScore.js';
import SeededRandom from './shared/SeededRandom.js';

const DEFAULT_LIMIT = 10;
const [mode, ...args] = process.argv.slice(2);
const predictions = readJson(PATHS.predictions);

function increment(counts, key) {
    counts.set(key, (counts.get(key) ?? 0) + 1);
}

function printSpans(count = DEFAULT_LIMIT) {
    const limit = Number(count);
    const counts = new Map();
    for (const prediction of Object.values(predictions))
        prediction.unrecognized.forEach(span => increment(counts, span));
    const sorted = [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit);
    for (const [span, total] of sorted) console.log(total, span.slice(0, 140));
}

function cardText(card) {
    return card.faces.map(face => face.oracle_text).join(' / ').replaceAll('\n', ' ¶ ');
}

function printCard(card, prediction, tag, showEvidence) {
    console.log('-', card.name, '|', cardText(card).slice(0, 230));
    if (showEvidence) console.log('     evidence:', prediction.tags[tag]);
    if (prediction.unrecognized.length)
        console.log('     unrecognized:', prediction.unrecognized.slice(0, 3));
}

function printMisses(misses, showEvidence, tag, count = DEFAULT_LIMIT) {
    const corpus = new Map(readJson(PATHS.corpus).map(card => [cardKey(card), card]));
    const keys = new SeededRandom(5).sample(misses[tag] ?? [], Number(count));
    for (const key of keys)
        printCard(corpus.get(key), predictions[key], tag, showEvidence);
}

function loadScore() {
    return TagScore.fromJSON(readJson(PATHS.score));
}

const MODES = {
    spans: printSpans,
    fps: (tag, count) => printMisses(loadScore().falsePositives, true, tag, count),
    fns: (tag, count) => printMisses(loadScore().falseNegatives, false, tag, count)
};

if (!MODES[mode]) {
    console.log('usage: diagnose.js spans [count]');
    console.log('       diagnose.js fps|fns <tag> [count]');
    process.exit(1);
}
MODES[mode](...args);
