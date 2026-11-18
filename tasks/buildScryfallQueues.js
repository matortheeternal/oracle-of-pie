import { readJson, writeJsonl } from '../src/files.js';
import { PATHS, queuePath } from '../src/paths.js';
import { cardKey } from '../src/corpusScribe.js';
import TagTree from '../src/TagTree.js';
import TagScore from '../src/TagScore.js';
import SeededRandom from '../src/SeededRandom.js';
import { notTaggedItem, notSuggestedItem } from '../src/queues/scryfallQueueItem.js';

const MISSED_SAMPLE_PER_TAG = 10;

const corpus = new Map(readJson(PATHS.corpus).map(card => [cardKey(card), card]));
const predictions = readJson(PATHS.predictions);
const score = TagScore.fromJSON(readJson(PATHS.score));
const tree = TagTree.load(PATHS.tags);
const random = new SeededRandom(7);

function context(tag, key) {
    return { card: corpus.get(key), key, tag, prediction: predictions[key], tree };
}

const notTagged = [];
const notSuggested = [];
for (const [tag, keys] of Object.entries(score.falsePositives))
    notTagged.push(...keys.map(key => notTaggedItem(context(tag, key))));
for (const [tag, keys] of Object.entries(score.falseNegatives)) {
    const sample = random.sample(keys, MISSED_SAMPLE_PER_TAG);
    notSuggested.push(...sample.map(key => notSuggestedItem(context(tag, key))));
}

writeJsonl(queuePath('scryfall-suggested-not-tagged'), notTagged);
writeJsonl(queuePath('scryfall-tagged-not-suggested'), notSuggested);
console.log({
    suggestedNotTagged: notTagged.length,
    taggedNotSuggested: notSuggested.length
});
