import path from 'node:path';
import { readJson, readJsonl } from '../src/files.js';
import { PATHS, QUEUES, queuePath } from '../src/paths.js';
import TagScore from '../src/TagScore.js';
import ReviewLog from '../src/ReviewLog.js';
import { formatRow, percent } from '../src/table.js';

const WIDTHS = [-22, 8, 4, 4, 7, 26];
const HEADER = ['tag', 'accepted', '✓', '✗', 'pending', 'precision (excl. pending)'];

function verdictCounts(queue) {
    const reviews = ReviewLog.forQueue(queue);
    const counts = {};
    for (const item of readJsonl(queuePath(queue))) {
        counts[item.tag] ??= { correct: 0, wrong: 0, pending: 0, skip: 0 };
        counts[item.tag][reviews.verdictFor(item.id)]++;
    }
    return counts;
}

function precisionRow(tag, accepted, counts) {
    const good = accepted + counts.correct;
    const reviewed = good + counts.wrong;
    const precision = reviewed ? percent(good / reviewed) : '-';
    const pending = counts.pending + counts.skip;
    return [tag, accepted, counts.correct, counts.wrong, pending, precision];
}

function printTable(title, counts, accepted) {
    console.log(`\n${title}`);
    console.log(formatRow(HEADER, WIDTHS));
    const empty = { correct: 0, wrong: 0, pending: 0, skip: 0 };
    const tags = [...new Set([...Object.keys(counts), ...Object.keys(accepted)])].sort();
    for (const tag of tags) {
        const row = precisionRow(tag, accepted[tag] ?? 0, counts[tag] ?? empty);
        console.log(formatRow(row, WIDTHS));
    }
}

function scryfallAccepted() {
    const score = TagScore.fromJSON(readJson(PATHS.score));
    return Object.fromEntries(score.rows.map(row => [row.tag, row.tp]));
}

printTable(
    'Custom cards: precision (accepted = already in your tags)',
    verdictCounts('custom-suggested-tags'),
    readJson(path.join(QUEUES, 'custom-suggested-tags.agreed.json'))
);
printTable(
    'Scryfall: precision (accepted = Scryfall agrees; reviewed = disagreements)',
    verdictCounts('scryfall-suggested-not-tagged'),
    scryfallAccepted()
);
