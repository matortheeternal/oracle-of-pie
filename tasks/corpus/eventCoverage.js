import TriggerEvent from '../../src/triggers/TriggerEvent.js';

export const EVENT_COVERAGE = ['read', 'partial', 'unsupported'];

function coverageOf(event) {
    if (event.isUnsupported) return 'unsupported';
    return event.isRecognized ? 'read' : 'partial';
}

function triggerEvents(parsed) {
    const nodes = parsed.walked.map(([node]) => node);
    return nodes.filter(node => node instanceof TriggerEvent);
}

export function emptyCoverage() {
    return Object.fromEntries(EVENT_COVERAGE.map(coverage => [coverage, 0]));
}

export function addCoverage(total, coverage) {
    for (const key of EVENT_COVERAGE) total[key] += coverage[key] ?? 0;
    return total;
}

export default function eventCoverage(faces) {
    const counts = emptyCoverage();
    for (const face of faces)
        for (const event of triggerEvents(face)) counts[coverageOf(event)]++;
    return counts;
}
