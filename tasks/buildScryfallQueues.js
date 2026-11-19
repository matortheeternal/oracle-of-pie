import { readJson, writeJsonl } from './shared/files.js';
import { PATHS, queuePath } from './shared/paths.js';
import { cardKey } from './corpus/corpusScribe.js';
import TagTree from './tags/TagTree.js';
import TagScore from './tags/TagScore.js';
import SeededRandom from './shared/SeededRandom.js';
import ReviewLog from './verdicts/ReviewLog.js';
import ReviewPriority from './queues/ReviewPriority.js';
import { notTaggedItem, notSuggestedItem } from './queues/scryfallQueueItem.js';

const MISSED_SAMPLE_PER_TAG = 10;

const corpus = new Map(readJson(PATHS.corpus).map(card => [cardKey(card), card]));
const predictions = readJson(PATHS.predictions);
const score = TagScore.fromJSON(readJson(PATHS.score));
const adjudicated = TagScore.fromJSON(readJson(PATHS.adjudicatedScore));
const tree = TagTree.load(PATHS.tags);
const random = new SeededRandom(7);

function context(tag, key) {
    return { card: corpus.get(key), key, tag, prediction: predictions[key], tree };
}

const notTagged = [];
const notSuggested = [];
for (const [tag, keys] of Object.entries(adjudicated.falsePositives))
    notTagged.push(...keys.map(key => notTaggedItem(context(tag, key))));
for (const [tag, keys] of Object.entries(score.falseNegatives)) {
    const sample = random.sample(keys, MISSED_SAMPLE_PER_TAG);
    notSuggested.push(...sample.map(key => notSuggestedItem(context(tag, key))));
}

const notTaggedReviews = ReviewLog.forQueue('scryfall-suggested-not-tagged');
const prioritized = new ReviewPriority(notTaggedReviews).order(notTagged);
writeJsonl(queuePath('scryfall-suggested-not-tagged'), prioritized);
writeJsonl(queuePath('scryfall-tagged-not-suggested'), notSuggested);
console.log({
    suggestedNotTagged: notTagged.length,
    taggedNotSuggested: notSuggested.length
});
