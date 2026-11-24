import { isDeepStrictEqual } from 'node:util';
import { addCoverage, emptyCoverage } from '../corpus/eventCoverage.js';

function tagChanges(before, after) {
    const changes = { added: 0, removed: 0, evidence: 0 };
    for (const tag of Object.keys(after)) {
        if (!Object.hasOwn(before, tag)) changes.added++;
        if (Object.hasOwn(before, tag) && !isDeepStrictEqual(before[tag], after[tag]))
            changes.evidence++;
    }
    for (const tag of Object.keys(before))
        if (!Object.hasOwn(after, tag)) changes.removed++;
    return changes;
}

function diagnosticChanges(before, after) {
    const fields = ['unrecognized', 'opaque', 'error'];
    return fields.filter(field => !isDeepStrictEqual(before[field], after[field]));
}

function describeChanges(changes, label, report) {
    const count = changes.reduce((sum, [, count]) => sum + count, 0);
    const cards = changes.map(([name, count]) => `${name} (${count})`);
    report.list(`${label} (${count}) on cards`, cards);
}

function compareCoverage(entries, field, label, report) {
    const totals = { before: 0, after: 0 };
    const gained = [];
    const lost = [];
    for (const { name, previous, current } of entries) {
        totals.before += Number(Boolean(previous[field]));
        totals.after += Number(Boolean(current[field]));
        if (!previous[field] && current[field]) gained.push(name);
        if (previous[field] && !current[field]) lost.push(name);
    }
    report.line(`${label} cards: ${totals.before} -> ${totals.after}`);
    report.list(`Newly ${label.toLowerCase()} cards`, gained);
    report.list(`Lost ${label.toLowerCase()} cards`, lost);
}

function compareRecognition(entries, report) {
    const events = { before: emptyCoverage(), after: emptyCoverage() };
    const coverage = [];
    const diagnostics = [];

    for (const { name, previous, current } of entries) {
        tallyEvents(events, coverage, name, previous.events, current.events);
        const fields = diagnosticChanges(previous, current);
        if (fields.length) diagnostics.push(`${name} (${fields.join(', ')})`);
    }

    compareCoverage(entries, 'recognized', 'Recognized', report);
    compareCoverage(entries, 'modeled', 'Modeled', report);
    report.line(`Events (read/partial/unsupported): ${eventCounts(events.before)}`
        + ` -> ${eventCounts(events.after)}`);
    report.list('Cards with changed event coverage', coverage);
    report.list('Cards with changed diagnostics', diagnostics);
}

function compareTags(entries, report) {
    const tags = { added: [], removed: [], evidence: [] };
    const changedTags = [];
    for (const { name, previous, current } of entries) {
        const { added, removed, evidence } = tagChanges(previous.tags, current.tags);
        if (added || removed) changedTags.push(name);
        if (added) tags.added.push([name, added]);
        if (removed) tags.removed.push([name, removed]);
        if (evidence) tags.evidence.push([name, evidence]);
    }
    report.list('Cards with changed predicted tag sets', changedTags);
    describeChanges(tags.added, 'Predicted tags added', report);
    describeChanges(tags.removed, 'Predicted tags removed', report);
    describeChanges(tags.evidence, 'Retained tags with changed evidence', report);
}

function eventCounts({ read, partial, unsupported }) {
    return `${read}/${partial}/${unsupported}`;
}

function tallyEvents(totals, changed, name, before = emptyCoverage(),
    after = emptyCoverage()) {
    addCoverage(totals.before, before);
    addCoverage(totals.after, after);
    if (!isDeepStrictEqual(before, after))
        changed.push(`${name}: ${eventCounts(before)} -> ${eventCounts(after)}`);
}

export default function comparePredictions(before, after, { cards, keys }, report) {
    const entries = keys.map(key => ({
        name: cards.get(key).name, previous: before[key], current: after[key]
    }));
    compareRecognition(entries, report);
    compareTags(entries, report);
}
