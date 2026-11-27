import { existsSync } from 'node:fs';
import { readJson, writeJsonl } from './shared/files.js';
import { PATHS, queuePath } from './shared/paths.js';
import ProjectScribes from './keywords/ProjectScribes.js';
import ReviewLog from './verdicts/ReviewLog.js';
import loadProjects from './custom/loadProjects.js';
import ReviewPriority from './queues/ReviewPriority.js';
import ProjectPieFlags from './pie/projectPieFlags.js';
import pieFlagItem from './pie/pieFlagItem.js';
import { judgementOfAll } from './pie/pieJudgement.js';
import sampleFlaggedCards from './pie/sampleFlaggedCards.js';
import { PIE_GATES } from './pie/pieGates.js';

const CUSTOM_QUEUE = 'custom-pie-flags';
const MONO_SAMPLE_SIZE = 50;
const SAMPLE_SIZES = { monocolor: MONO_SAMPLE_SIZE, hybrid: Infinity };

const corpus = readJson(PATHS.corpus);
const profiles = readJson(PATHS.pieProfiles);
const baseline = readJson(PATHS.pieVerdictBaseline);

function printedView(card) {
    const { name, rarity, faces, image, scryfall_uri } = card;
    return { name, rarity, faces, image, scryfall_uri };
}

function groupedFlags(flags, keyOf) {
    const groups = new Map();
    for (const flag of flags) {
        const key = keyOf(flag);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(flag);
    }
    return [...groups.values()];
}

function customItems() {
    const cards = loadProjects().filter(card => card.isPlayable);
    const pieFlags = new ProjectPieFlags(new ProjectScribes(corpus, cards), profiles);
    const items = [];
    for (const card of cards) {
        const groups = groupedFlags(pieFlags.flagsFor(card), flag => flag.inspection);
        for (const flags of groups) {
            const profile = profiles[flags[0].inspection];
            items.push(pieFlagItem({ id: card.id, card: card.view, flags, profile }));
        }
    }
    return items;
}

const byName = new Map(corpus.map(card => [card.name, card]));
const printedFlags = readJson(PATHS.pieFlags);
const citationCandidates = existsSync(PATHS.pieCitationCandidates)
    ? readJson(PATHS.pieCitationCandidates) : [];
const printedGroupKey = flag => JSON.stringify([flag.name, flag.inspection]);

function printedItem(flags) {
    const [{ name, inspection }] = flags;
    const card = byName.get(name);
    return pieFlagItem({
        id: card.oracle_id,
        card: printedView(card),
        flags,
        profile: profiles[inspection]
    });
}

function citationItems(policy) {
    const candidates = citationCandidates.filter(flag => flag.policy === policy);
    const sampled = sampleFlaggedCards(candidates, SAMPLE_SIZES[policy]);
    return groupedFlags(sampled, printedGroupKey).map(printedItem);
}

function printedItems(policy, reviews) {
    const flags = printedFlags.filter(flag => flag.policy === policy);
    const sampled = sampleFlaggedCards(flags, SAMPLE_SIZES[policy]);
    const keyOf = printedGroupKey;
    const selected = new Set(sampled.map(keyOf));
    const items = [];
    for (const group of groupedFlags(flags, keyOf)) {
        const [flag] = group;
        const { name, inspection } = flag;
        const card = byName.get(name);
        const id = `${card.oracle_id}|${inspection}`;
        if (!selected.has(keyOf(flag)) && !matchesReviewedFlag(reviews, id, group))
            continue;
        items.push(printedItem(group));
    }
    const included = new Set(items.map(item => item.id));
    const extra = citationItems(policy).filter(item => !included.has(item.id));
    return [...items, ...extra];
}

function matchesReviewedFlag(reviews, id, flags) {
    return !reviews.isPending(id) && baseline[id] === judgementOfAll(flags);
}

const PRINTED_QUEUES = PIE_GATES.map(gate => [
    gate.queue, printedItems(gate.policy, ReviewLog.forQueue(gate.queue))
]);
const QUEUES = [[CUSTOM_QUEUE, customItems()], ...PRINTED_QUEUES];
for (const [queue, items] of QUEUES) {
    const ordered = new ReviewPriority(ReviewLog.forQueue(queue)).order(items);
    writeJsonl(queuePath(queue), ordered);
    console.log(`${queue}: ${items.length} items`);
}
