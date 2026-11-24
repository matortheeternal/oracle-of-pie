import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeReadableJson } from '../shared/files.js';
import { PATHS, DATA } from '../shared/paths.js';
import { cardKey, evaluatedTags } from '../corpus/corpusScribe.js';
import TagTree from '../tags/TagTree.js';
import TagScore from '../tags/TagScore.js';
import ReviewLog from '../verdicts/ReviewLog.js';
import MtgishAdapter from './MtgishAdapter.js';
import pieReviews from './pieReviews.js';
import { SPIKE_TAGS, SPIKE_INSPECTIONS } from './mtgishSemantics.js';

const defaultDestination = path.join(DATA, 'research', 'mtgish');
const [input, destination = defaultDestination] = process.argv.slice(2);
if (!input) throw new Error('Usage: node tasks/research/compareMtgish.js JSONL [OUTPUT]');
fs.mkdirSync(destination, { recursive: true });
const corpus = readJson(PATHS.corpus);
const baseline = readJson(PATHS.predictions);
const tree = TagTree.load(PATHS.tags);
const adapter = new MtgishAdapter(input);
const allTags = evaluatedTags(corpus, tree);
const scores = {
    baselineAll: new TagScore(allTags), spikeAll: new TagScore(allTags),
    baselineMapped: new TagScore(SPIKE_TAGS), spikeMapped: new TagScore(SPIKE_TAGS),
    baselineAvailable: new TagScore(SPIKE_TAGS), spikeAvailable: new TagScore(SPIKE_TAGS)
};
const predictions = {};
const availability = { cards: corpus.length, available: 0, missing: [] };

function scoreCard(card) {
    const key = cardKey(card);
    const prediction = adapter.predict(card);
    predictions[key] = prediction;
    const gold = tree.withAncestors(card.tags);
    const ours = tree.withAncestors(Object.keys(baseline[key].tags));
    const theirs = tree.withAncestors(Object.keys(prediction.tags));
    scores.baselineAll.add(key, ours, gold);
    scores.spikeAll.add(key, theirs, gold);
    scores.baselineMapped.add(key, ours, gold);
    scores.spikeMapped.add(key, theirs, gold);
    if (!prediction.available) return availability.missing.push(card.name);
    availability.available++;
    scores.baselineAvailable.add(key, ours, gold);
    scores.spikeAvailable.add(key, theirs, gold);
}

function reviewResults(queue) {
    const result = { compared: 0, baselineAgrees: 0, spikeAgrees: 0, missing: 0 };
    for (const [id, verdict] of ReviewLog.forQueue(queue).decided) {
        const { cardId, tag } = ReviewLog.parseId(id);
        if (!SPIKE_TAGS.includes(tag) || !predictions[cardId]) continue;
        const expected = verdict === 'correct';
        result.compared++;
        if (!predictions[cardId].available) result.missing++;
        const ours = tree.withAncestors(Object.keys(baseline[cardId].tags));
        const theirs = tree.withAncestors(Object.keys(predictions[cardId].tags));
        if (ours.has(tag) === expected) result.baselineAgrees++;
        if (theirs.has(tag) === expected) result.spikeAgrees++;
    }
    return result;
}

function flagKey(card, flag) {
    return `${card}|${flag.inspection}|${flag.severity}|${flag.offending.join('')}`;
}

function compareFlags() {
    const expected = new Set();
    const actual = new Set();
    for (const flag of readJson(PATHS.pieFlags)) {
        if (SPIKE_INSPECTIONS.includes(flag.inspection))
            expected.add(flagKey(flag.name, flag));
    }
    for (const card of corpus) {
        for (const flag of predictions[cardKey(card)].flags)
            actual.add(flagKey(card.name, flag));
    }
    const common = [...actual].filter(key => expected.has(key));
    return {
        baselineFlags: expected.size, spikeFlags: actual.size,
        matching: common.length,
        baselineOnly: [...expected].filter(key => !actual.has(key)),
        spikeOnly: [...actual].filter(key => !expected.has(key))
    };
}

for (const card of corpus) scoreCard(card);
const summary = {
    input: path.resolve(input), availability,
    mappedTags: SPIKE_TAGS, mappedInspections: SPIKE_INSPECTIONS,
    scores: Object.fromEntries(Object.entries(scores).map(([name, score]) =>
        [name, { micro: score.micro, rows: score.rows }])),
    reviews: {
        suggested: reviewResults('scryfall-suggested-not-tagged'),
        tagged: reviewResults('scryfall-tagged-not-suggested')
    },
    pieReviews: pieReviews(corpus, readJson(PATHS.pieFlags), predictions),
    pieAgreement: compareFlags()
};
writeReadableJson(path.join(destination, 'summary.json'), summary);
writeReadableJson(path.join(destination, 'predictions.json'), predictions);
console.log(JSON.stringify({
    cards: availability.cards, available: availability.available,
    scores: Object.fromEntries(Object.entries(scores).map(([key, score]) =>
        [key, score.micro])),
    reviews: summary.reviews,
    pieReviews: summary.pieReviews,
    pie: {
        baseline: summary.pieAgreement.baselineFlags,
        spike: summary.pieAgreement.spikeFlags,
        matching: summary.pieAgreement.matching
    }
}, null, 2));
