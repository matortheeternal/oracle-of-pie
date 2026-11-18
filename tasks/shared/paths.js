import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS_SRC = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = path.resolve(TOOLS_SRC, '..', '..');
export const DATA = path.join(ROOT, 'data');
export const QUEUES = path.join(ROOT, 'queues');
export const REVIEWS = path.join(ROOT, 'reviews');

export const PATHS = {
    corpus: path.join(DATA, 'corpus.json'),
    tags: path.join(DATA, 'tags.json'),
    predictions: path.join(DATA, 'predictions.json'),
    pieProfiles: path.join(DATA, 'pie-profiles.json'),
    pieFlags: path.join(DATA, 'pie-flags.json'),
    gapReport: path.join(DATA, 'gap-report.json'),
    score: path.join(DATA, 'tag-score.json'),
    customKeywords: path.join(DATA, 'custom-keywords.json'),
    projects: path.join(ROOT, 'review', 'projects.json'),
    knownDisagreements: path.join(ROOT, 'review', 'known-disagreements.json')
};

export function queuePath(name) {
    return path.join(QUEUES, `${name}.jsonl`);
}

export function reviewPath(name) {
    return path.join(REVIEWS, `${name}.jsonl`);
}
