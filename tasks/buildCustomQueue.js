import { readJson, writeJson, writeJsonl } from '../src/files.js';
import { PATHS, QUEUES, queuePath } from '../src/paths.js';
import { evaluatedTags } from '../src/corpusScribe.js';
import ProjectScribes from '../src/keywords/ProjectScribes.js';
import TagTree from '../src/TagTree.js';
import TagScore from '../src/TagScore.js';
import ReviewLog from '../src/ReviewLog.js';
import loadProjects from '../src/custom/loadProjects.js';
import CustomSuggestions from '../src/queues/CustomSuggestions.js';
import ReviewPriority from '../src/queues/ReviewPriority.js';
import { formatRow, percent } from '../src/table.js';
import path from 'node:path';

const QUEUE = 'custom-suggested-tags';
const WIDTHS = [-22, 6, 6, 0];

const reviews = ReviewLog.forQueue(QUEUE);
const cards = loadProjects(PATHS.projects);
const corpus = readJson(PATHS.corpus);
const tree = TagTree.load(PATHS.tags);
const scribes = new ProjectScribes(corpus, cards);
writeJson(PATHS.customKeywords, scribes.definitionsByProject);
const suggestions = new CustomSuggestions({
    scribes,
    tree,
    reviews,
    agreement: new TagScore(evaluatedTags(corpus, tree))
});
for (const card of cards) suggestions.addCard(card);

function printAgreement(agreement) {
    console.log(formatRow(['tag (vs your tags)', 'P', 'R', ' tp/fp/fn'], WIDTHS));
    for (const row of agreement.rows) {
        if (!row.tp && !row.fp && !row.fn) continue;
        const precision = row.tp + row.fp ? percent(row.precision, 0) : '-';
        const recall = row.tp + row.fn ? percent(row.recall, 0) : '-';
        const counts = ` ${row.tp}/${row.fp}/${row.fn}`;
        console.log(formatRow([row.tag, precision, recall, counts], WIDTHS));
    }
    const { precision, recall } = agreement.micro;
    console.log(`micro P ${percent(precision)} R ${percent(recall)}`);
}

const { agreement, items, stats } = suggestions;
writeJsonl(queuePath(QUEUE), new ReviewPriority(reviews).order(items));
const agreed = Object.fromEntries(agreement.rows.map(row => [row.tag, row.tp]));
writeJson(path.join(QUEUES, `${QUEUE}.agreed.json`), agreed);
console.log(JSON.stringify(stats, null, 1));
printAgreement(agreement);
console.log(`${items.length} queue items (suggestions not already in your tags)`);
