import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TASKS_SHARED = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = path.resolve(TASKS_SHARED, '..', '..');
const PIE_SOURCE = path.join(ROOT, 'src', 'pie');
export const DATA = path.join(ROOT, 'data');
export const QUEUES = path.join(ROOT, 'queues');
export const REVIEWS = path.join(ROOT, 'reviews');

export const PATHS = {
    corpus: path.join(DATA, 'corpus.json'),
    tags: path.join(DATA, 'tags.json'),
    predictions: path.join(DATA, 'predictions.json'),
    pieProfiles: path.join(DATA, 'pie-profiles.json'),
    pieFlags: path.join(DATA, 'pie-flags.json'),
    pieCitationCandidates: path.join(DATA, 'pie-citation-candidates.json'),
    pieSummary: path.join(DATA, 'pie-summary.json'),
    canonTiers: path.join(PIE_SOURCE, 'canonTierTable.js'),
    keywordCanon: path.join(PIE_SOURCE, 'keywordCanon.json'),
    gapReport: path.join(DATA, 'gap-report.json'),
    astFixtures: path.join(ROOT, 'tasks', 'ast', 'fixtures'),
    score: path.join(DATA, 'tag-score.json'),
    adjudicatedScore: path.join(DATA, 'tag-score-adjudicated.json'),
    customKeywords: path.join(DATA, 'custom-keywords.json'),
    projects: path.join(REVIEWS, 'projects.json'),
    knownDisagreements: path.join(REVIEWS, 'known-disagreements.json'),
    pieVerdictBaseline: path.join(REVIEWS, 'pie-verdict-baseline.json')
};

export function queuePath(name) {
    return path.join(QUEUES, `${name}.jsonl`);
}

export function reviewPath(name) {
    return path.join(REVIEWS, `${name}.jsonl`);
}
