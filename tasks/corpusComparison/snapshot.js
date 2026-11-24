import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { CANON_TIERS } from '../../src/pie/canonTierTable.js';
import { cardKey } from '../corpus/corpusScribe.js';
import { EVENT_COVERAGE } from '../corpus/eventCoverage.js';
import { readJson } from '../shared/files.js';
import { PATHS } from '../shared/paths.js';

const VERSION = 1;
const INPUTS = ['predictions', 'score', 'pieFlags', 'pieProfiles', 'pieSummary'];

function sortedProperties(key, value) {
    if (!isRecord(value)) return value;
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, value[key]]));
}

export function stableJson(value) {
    return JSON.stringify(value, sortedProperties);
}

function requireShape(valid, source, expected) {
    if (!valid) throw new Error(`${source}: incompatible format (expected ${expected})`);
}

function load(file) {
    try {
        return readJson(file);
    } catch (error) {
        throw new Error(`Cannot read ${file}: ${error.code ?? error.message}`);
    }
}

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isCount(value) {
    return Number.isSafeInteger(value) && value >= 0;
}

function isCard(card) {
    return typeof card?.name === 'string' && Array.isArray(card.faces)
        && Array.isArray(card.tags);
}

export function loadCorpus() {
    const corpus = load(PATHS.corpus);
    requireShape(Array.isArray(corpus) && corpus.every(isCard), PATHS.corpus, 'cards');
    const cards = new Map(corpus.map(card => [cardKey(card), card]));
    const keys = [...cards.keys()].sort();
    const byName = new Map(corpus.map(card => [card.name, cardKey(card)]));
    requireShape(cards.size === corpus.length && byName.size === corpus.length,
                 PATHS.corpus, 'unique card IDs and names');
    const hash = createHash('sha256');
    const taxonomy = load(PATHS.tags);
    requireShape(isRecord(taxonomy), PATHS.tags, 'tag taxonomy');
    hash.update(stableJson(taxonomy));
    for (const key of keys) hash.update(stableJson(cards.get(key)));
    return { cards, keys, byName, digest: hash.digest('hex') };
}

function isPrediction(result) {
    return isRecord(result?.tags) && typeof result.recognized === 'boolean'
        && Array.isArray(result.unrecognized)
        && (hasCoverage(result) || isFailedPrediction(result));
}

function isFailedPrediction(result) {
    return typeof result.error === 'string' && result.events === undefined;
}

function hasCoverage(result) {
    return isCount(result.opaque)
        && EVENT_COVERAGE.every(key => isCount(result.events?.[key]));
}

function validatePredictions(predictions, { keys }, source) {
    requireShape(isRecord(predictions), source, 'predictions keyed by card ID');
    requireShape(isDeepStrictEqual(Object.keys(predictions).sort(), keys),
                 source, 'predictions for exactly the input corpus card IDs');
    requireShape(Object.values(predictions).every(isPrediction),
                 source, 'predictions with recognition, tags and event coverage');
}

function isTagCount(count) {
    return ['tp', 'fp', 'fn'].every(key => isCount(count?.[key]));
}

function isPieFlag(flag, byName) {
    return byName.has(flag?.name) && typeof flag.inspection === 'string'
        && typeof flag.policy === 'string' && typeof flag.severity === 'string'
        && Array.isArray(flag.offending) && hasFlagTiers(flag.tiers);
}

function hasFlagTiers(tiers) {
    return isRecord(tiers) && Object.values(tiers).every(tier => {
        return typeof tier?.tier === 'string';
    });
}

function isCountMap(value) {
    return isRecord(value) && Object.values(value).every(isCount);
}

function isProfile(profile) {
    const examples = profile?.examples;
    return [profile?.counts, profile?.totals].every(isCountMap)
        && isRecord(examples) && Object.values(examples).every(Array.isArray);
}

function validate(snapshot, corpus, sources) {
    const { predictions, score, pieFlags, pieProfiles, pieSummary } = snapshot;
    const { canonTiers } = snapshot;
    validatePredictions(predictions, corpus, sources.predictions);
    const counts = score?.counts;
    requireShape(isRecord(counts) && Object.values(counts).every(isTagCount),
                 sources.score, 'per-tag TP/FP/FN counts');
    requireShape(Array.isArray(pieFlags)
        && pieFlags.every(flag => isPieFlag(flag, corpus.byName)),
                 sources.pieFlags, 'pie flags for cards in the input corpus');
    requireShape(isRecord(pieProfiles) && Object.values(pieProfiles).every(isProfile),
                 sources.pieProfiles, 'pie profiles with counts, totals and examples');
    requireShape([pieSummary?.totals, pieSummary?.flagged].every(isCountMap),
                 sources.pieSummary, 'pie summary totals and flagged counts by policy');
    requireShape(isRecord(canonTiers) && Object.values(canonTiers).every(isRecord),
                 sources.canonTiers, 'canon tiers by inspection');
    return snapshot;
}

export function loadCurrent(corpus) {
    const outputs = Object.fromEntries(INPUTS.map(key => [key, load(PATHS[key])]));
    return validate({
        ...outputs,
        score: { counts: outputs.score?.counts },
        canonTiers: CANON_TIERS,
        version: VERSION,
        corpusDigest: corpus.digest
    }, corpus, PATHS);
}

export function loadBaseline(file, corpus) {
    const snapshot = load(file);
    requireShape(snapshot?.version === VERSION, file, `baseline version ${VERSION}`);
    requireShape(typeof snapshot.corpusDigest === 'string', file, 'corpus digest');
    if (snapshot.corpusDigest !== corpus.digest)
        throw new Error(`${file}: input corpus or tag taxonomy mismatch`);
    const sources = Object.fromEntries([...INPUTS, 'canonTiers']
        .map(key => [key, `${file} (${key})`]));
    return validate(snapshot, corpus, sources);
}
