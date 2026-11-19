import fs from 'node:fs';
import { readJson, writeReadableJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import ProjectScribes from './keywords/ProjectScribes.js';
import TagTree from './tags/TagTree.js';
import ReviewLog from './verdicts/ReviewLog.js';
import VerdictCheck from './verdicts/VerdictCheck.js';
import reviewedCards from './verdicts/reviewedCards.js';
import { VERDICT_QUEUES } from './verdicts/verdictQueues.js';

const ACCEPT_FLAG = '--accept-known';
const LISTED_OUTCOMES = new Set(['regressed', 'fixed']);
const UNRESOLVED_OUTCOMES = new Set(['regressed', 'known']);

function readKnown() {
    if (!fs.existsSync(PATHS.knownDisagreements)) return new Set();
    return new Set(readJson(PATHS.knownDisagreements));
}

const corpus = readJson(PATHS.corpus);
const cards = reviewedCards(corpus, PATHS.projects);
const check = new VerdictCheck({
    scribes: new ProjectScribes(corpus, [...cards.values()]),
    tree: TagTree.load(PATHS.tags),
    cards,
    known: readKnown()
});

function tally(outcomes) {
    const counts = {};
    for (const { outcome } of outcomes) counts[outcome] = (counts[outcome] ?? 0) + 1;
    return counts;
}

function report(queue) {
    const outcomes = check.check(queue, ReviewLog.forQueue(queue.name));
    console.log(`${queue.name}: ${JSON.stringify(tally(outcomes))}`);
    const listed = outcomes.filter(({ outcome }) => LISTED_OUTCOMES.has(outcome));
    for (const { id, verdict, outcome } of listed)
        console.log(`  ${outcome} (${verdict}): ${id}`);
    return outcomes;
}

const outcomes = VERDICT_QUEUES.flatMap(report);
const unresolved = outcomes.filter(({ outcome }) => UNRESOLVED_OUTCOMES.has(outcome));
if (process.argv.includes(ACCEPT_FLAG))
    writeReadableJson(PATHS.knownDisagreements, unresolved.map(({ id }) => id).sort());
const regressed = outcomes.some(({ outcome }) => outcome === 'regressed');
if (regressed && !process.argv.includes(ACCEPT_FLAG)) process.exitCode = 1;
