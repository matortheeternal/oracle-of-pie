import fs from 'node:fs';
import { readJson, writeReadableJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import { cardKey } from './corpus/corpusScribe.js';
import ReviewLog from './verdicts/ReviewLog.js';
import loadProjects from './custom/loadProjects.js';
import ProjectScribes from './keywords/ProjectScribes.js';
import ProjectPieFlags from './pie/projectPieFlags.js';
import PrintedPieFlags from './pie/PrintedPieFlags.js';
import PieVerdictCheck from './verdicts/PieVerdictCheck.js';
import { FAILING_OUTCOMES } from './verdicts/pieVerdictOutcomes.js';
import { PIE_GATES } from './pie/pieGates.js';

const ACCEPT_FLAG = '--accept';
const CUSTOM_QUEUE = 'custom-pie-flags';
const LISTED_OUTCOMES = new Set(['regressed', 'changed', 'fixed']);

function readBaseline() {
    if (!fs.existsSync(PATHS.pieVerdictBaseline)) return {};
    return readJson(PATHS.pieVerdictBaseline);
}

const corpus = readJson(PATHS.corpus);
const profiles = readJson(PATHS.pieProfiles);
const baseline = readBaseline();
const projectCards = loadProjects().filter(card => card.isPlayable);

const printed = new PieVerdictCheck({
    cards: new Map(corpus.map(card => [cardKey(card), card])),
    flags: new PrintedPieFlags(corpus, profiles),
    baseline
});
const custom = new PieVerdictCheck({
    cards: new Map(projectCards.map(card => [card.id, card])),
    flags: new ProjectPieFlags(new ProjectScribes(corpus, projectCards), profiles),
    baseline
});
const QUEUES = [
    [CUSTOM_QUEUE, custom],
    ...PIE_GATES.map(gate => [gate.queue, printed])
];

function tally(verdicts) {
    const counts = {};
    for (const { outcome } of verdicts) counts[outcome] = (counts[outcome] ?? 0) + 1;
    return counts;
}

function report([queue, check]) {
    const verdicts = check.check(ReviewLog.forQueue(queue));
    console.log(`${queue}: ${JSON.stringify(tally(verdicts))}`);
    const listed = verdicts.filter(({ outcome }) => LISTED_OUTCOMES.has(outcome));
    for (const { outcome, verdict, id, change } of listed)
        console.log(`  ${outcome} (${verdict}): ${id}  ${change}`);
    return verdicts;
}

const verdicts = QUEUES.flatMap(report);
if (process.argv.includes(ACCEPT_FLAG)) {
    const entries = verdicts.map(({ id, judgement }) => [id, judgement]);
    writeReadableJson(PATHS.pieVerdictBaseline, Object.fromEntries(entries.sort()));
}
const failing = verdicts.some(({ outcome }) => FAILING_OUTCOMES.has(outcome));
if (failing && !process.argv.includes(ACCEPT_FLAG)) process.exitCode = 1;
