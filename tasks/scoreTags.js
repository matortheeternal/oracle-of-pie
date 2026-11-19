import { readJson, writeJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import { cardKey, evaluatedTags } from './corpus/corpusScribe.js';
import TagTree from './tags/TagTree.js';
import TagScore from './tags/TagScore.js';
import { formatRow, percent } from './shared/table.js';

const WIDTHS = [-22, 5, 6, 6, 6];

const corpus = readJson(PATHS.corpus);
const predictions = readJson(PATHS.predictions);
const tree = TagTree.load(PATHS.tags);
const score = new TagScore(evaluatedTags(corpus, tree));

for (const card of corpus) {
    const key = cardKey(card);
    const predicted = tree.withAncestors(Object.keys(predictions[key]?.tags ?? {}));
    score.add(key, predicted, tree.withAncestors(card.tags));
}

console.log(formatRow(['tag', 'gold', 'P', 'R', 'F1'], WIDTHS));
for (const row of score.rows) {
    const cells = [row.tag, row.gold, percent(row.precision), percent(row.recall)];
    console.log(formatRow([...cells, percent(row.f1)], WIDTHS));
}
const { precision, recall } = score.micro;
console.log(`micro P ${percent(precision)} R ${percent(recall)}`);
writeJson(PATHS.score, score);
