import { readJson, writeJsonl } from './shared/files.js';
import { PATHS, queuePath } from './shared/paths.js';
import ProjectScribes from './keywords/ProjectScribes.js';
import ReviewLog from './verdicts/ReviewLog.js';
import loadProjects from './custom/loadProjects.js';
import ReviewPriority from './queues/ReviewPriority.js';
import ProjectPieFlags from './pie/projectPieFlags.js';
import pieFlagItem from './pie/pieFlagItem.js';
import sampleFlaggedCards from './pie/sampleFlaggedCards.js';
import { PIE_GATES } from './pie/pieGates.js';

const CUSTOM_QUEUE = 'custom-pie-flags';
const MONO_SAMPLE_SIZE = 50;
const SAMPLE_SIZES = { monocolor: MONO_SAMPLE_SIZE, hybrid: Infinity };

const corpus = readJson(PATHS.corpus);
const profiles = readJson(PATHS.pieProfiles);

function printedView(card) {
    const { name, rarity, faces, image, scryfall_uri } = card;
    return { name, rarity, faces, image, scryfall_uri };
}

function customItems() {
    const cards = loadProjects().filter(card => card.isPlayable);
    const pieFlags = new ProjectPieFlags(new ProjectScribes(corpus, cards), profiles);
    const items = [];
    for (const card of cards) {
        for (const flag of pieFlags.flagsFor(card)) {
            const profile = profiles[flag.inspection];
            items.push(pieFlagItem({ id: card.id, card: card.view, flag, profile }));
        }
    }
    return items;
}

const byName = new Map(corpus.map(card => [card.name, card]));
const printedFlags = readJson(PATHS.pieFlags);

function printedItems(policy) {
    const flags = printedFlags.filter(flag => flag.policy === policy);
    const sampled = sampleFlaggedCards(flags, SAMPLE_SIZES[policy]);
    return sampled.map(flag => {
        const card = byName.get(flag.name);
        const profile = profiles[flag.inspection];
        const view = printedView(card);
        return pieFlagItem({ id: card.oracle_id, card: view, flag, profile });
    });
}

const PRINTED_QUEUES = PIE_GATES.map(gate => [gate.queue, printedItems(gate.policy)]);
const QUEUES = [[CUSTOM_QUEUE, customItems()], ...PRINTED_QUEUES];
for (const [queue, items] of QUEUES) {
    const ordered = new ReviewPriority(ReviewLog.forQueue(queue)).order(items);
    writeJsonl(queuePath(queue), ordered);
    console.log(`${queue}: ${items.length} items`);
}
