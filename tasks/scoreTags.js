import { readJson, writeJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import { cardKey, evaluatedTags } from './corpus/corpusScribe.js';
import TagTree from './tags/TagTree.js';
import TagScore from './tags/TagScore.js';
import AdjudicatedGold from './tags/AdjudicatedGold.js';
import { formatRow, percent } from './shared/table.js';

const WIDTHS = [-22, 5, 6, 6, 7, 7];

const corpus = readJson(PATHS.corpus);
const predictions = readJson(PATHS.predictions);
const tree = TagTree.load(PATHS.tags);
const adjudicated = AdjudicatedGold.load(tree);
const tags = evaluatedTags(corpus, tree);
const raw = new TagScore(tags);
const intended = new TagScore(tags);
const explainedByPolicy = {};

function countExplanations(explained) {
    for (const id of Object.values(explained))
        explainedByPolicy[id] = (explainedByPolicy[id] ?? 0) + 1;
}

for (const card of corpus) {
    const key = cardKey(card);
    const prediction = predictions[key] ?? {};
    const predicted = tree.withAncestors(Object.keys(prediction.tags ?? {}));
    const explained = prediction.explained ?? {};
    raw.add(key, predicted, tree.withAncestors(card.tags));
    intended.add(key, predicted, adjudicated.tagsFor(card, key, explained));
    countExplanations(explained);
}

console.log(formatRow(['tag', 'gold', 'P', 'R', 'adj P', 'adj R'], WIDTHS));
for (const row of raw.rows) {
    const adjusted = intended.rowFor(row.tag);
    const rates = [row.precision, row.recall, adjusted.precision, adjusted.recall];
    const cells = rates.map(rate => percent(rate));
    console.log(formatRow([row.tag, row.gold, ...cells], WIDTHS));
}

function summarize({ precision, recall }) {
    return `P ${percent(precision)} R ${percent(recall)}`;
}

console.log(`micro ${summarize(raw.micro)}`);
console.log(`adjudicated ${summarize(intended.micro)}`);
console.log('explained by policy', explainedByPolicy);
writeJson(PATHS.score, raw);
writeJson(PATHS.adjudicatedScore, intended);
