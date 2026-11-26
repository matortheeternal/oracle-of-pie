import fs from 'node:fs';
import path from 'node:path';
import { homedir } from 'node:os';
import { once } from 'node:events';
import { DEFAULT_KEYWORDS, Oracle } from '../src/index.js';
import { DATA } from './shared/paths.js';
import { writeJson } from './shared/files.js';
import EggHubSet from './egghub/EggHubSet.js';
import EggHubAudit from './egghub/EggHubAudit.js';

const DEFAULT_ROOT = path.join(homedir(), 'git', 'aether-index', 'data', 'egghub');
const root = path.resolve(process.argv[2] ?? DEFAULT_ROOT);
const files = fs.readdirSync(root, { recursive: true })
    .filter(file => file.endsWith('.json')).sort();
const projects = new Map();
const failedSets = [];

function addSet(file) {
    const set = new EggHubSet(root, path.join(root, file));
    if (!projects.has(set.project)) projects.set(set.project, []);
    projects.get(set.project).push(set);
}

for (const file of files) {
    try {
        addSet(file);
    } catch (error) {
        failedSets.push({ file, message: error.message });
    }
}

const audit = new EggHubAudit();
const keywords = {};
const actions = {};
fs.mkdirSync(DATA, { recursive: true });
const output = fs.createWriteStream(path.join(DATA, 'egghub-corpus.jsonl'));
const gapOutput = fs.createWriteStream(path.join(DATA, 'egghub-gap-entries.jsonl'));
let rows = 0;
let cards = 0;
let setsRead = 0;

async function processSet(set, scribe) {
    rows += set.rows.length;
    setsRead++;
    if (setsRead % 100 === 0) console.log(`Parsing set ${setsRead} of ${files.length}`);
    for (const card of set.cards()) {
        cards++;
        if (!output.write(JSON.stringify(card) + '\n')) await once(output, 'drain');
        const gaps = audit.measure(card, scribe).map(({ raw, context, kind }) =>
            [raw, context, kind]);
        if (!gaps.length) continue;
        const entry = JSON.stringify([card.id, card.name, gaps]);
        if (!gapOutput.write(entry + '\n')) await once(gapOutput, 'drain');
    }
}

for (const [project, sets] of projects) {
    const harvested = audit.harvest(sets);
    keywords[project] = harvested.keywords;
    actions[project] = harvested.actions;
    const names = harvested.keywords.map(definition => definition.name);
    const scribe = names.length || harvested.actions.length
        ? new Oracle({
            keywords: [...DEFAULT_KEYWORDS, ...names],
            definitions: { actions: harvested.actions }
        })
        : audit.base;
    for (const set of sets) await processSet(set, scribe);
}
await Promise.all([output, gapOutput].map(stream => {
    stream.end();
    return once(stream, 'finish');
}));

const summary = {
    setsRead, rows, cards, projects: projects.size, failedSets,
    failures: audit.failures.length,
    baselineModeled: audit.baselineModeled,
    modeled: audit.report.recognized,
    ...audit.offset
};
writeJson(path.join(DATA, 'egghub-gap-report.json'), {
    summary, keywords, actions, failures: audit.failures, ...audit.report.toJSON()
});
console.log(summary);
