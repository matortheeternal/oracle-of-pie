import { isDeepStrictEqual } from 'node:util';
import { stableJson } from './snapshot.js';

function groupFlags(flags, byName) {
    const cards = new Set();
    const groups = new Map();
    for (const flag of flags) {
        const card = byName.get(flag.name);
        const key = JSON.stringify([card, flag.inspection]);
        cards.add(card);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(flag);
    }
    return { cards, groups };
}

function flagDecision({ exception, colors, policy, severity, offending, tiers }) {
    const colorTiers = Object.fromEntries(Object.entries(tiers)
        .map(([color, entry]) => [color, entry.tier]));
    return { exception, colors, policy, severity,
        offending: [...offending].sort(), colorTiers };
}

function signatures(flags, project = flag => flag) {
    return flags.map(flag => stableJson(project(flag))).sort();
}

function describeFlag(flag) {
    const decision = flagDecision(flag);
    const { exception, colors, policy, severity, offending, colorTiers } = decision;
    const tiers = Object.keys(colorTiers).sort()
        .map(color => `${color}=${colorTiers[color]}`);
    const detail = [colors, policy, severity, `offending ${offending.join('')}`];
    if (exception) detail.push(`exception ${exception}`);
    return [...detail, ...tiers].join(', ');
}

function decisions(flags) {
    return flags.map(describeFlag).sort().join(' / ');
}

function cardNamesOnlyIn(first, second, cards) {
    return [...first].sort().filter(key => !second.has(key))
        .map(key => cards.get(key).name);
}

function diffFlags(before, after, { byName, cards }, report) {
    const previous = groupFlags(before, byName);
    const current = groupFlags(after, byName);
    const keys = [...new Set([...previous.groups.keys(), ...current.groups.keys()])];
    const added = [];
    const removed = [];
    const changed = [];
    const evidence = [];
    for (const key of keys.sort()) {
        const [card, inspection] = JSON.parse(key);
        const label = `${cards.get(card).name} [${inspection}]`;
        const from = previous.groups.get(key) ?? [];
        const to = current.groups.get(key) ?? [];
        if (isDeepStrictEqual(signatures(from), signatures(to))) continue;
        if (!from.length) {
            added.push(`${label} (${to.length})`);
            continue;
        }
        if (!to.length) {
            removed.push(`${label} (${from.length})`);
            continue;
        }
        const oldDecisions = signatures(from, flagDecision);
        const newDecisions = signatures(to, flagDecision);
        if (isDeepStrictEqual(oldDecisions, newDecisions)) {
            evidence.push(label);
            continue;
        }
        changed.push(`${label}: ${decisions(from)} -> ${decisions(to)}`);
    }
    report.line(`Pie flags: ${before.length} -> ${after.length}`
        + ` on ${previous.cards.size} -> ${current.cards.size} distinct cards`);
    report.list('Newly flagged cards',
                cardNamesOnlyIn(current.cards, previous.cards, cards));
    report.list('Cards no longer flagged',
                cardNamesOnlyIn(previous.cards, current.cards, cards));
    report.list('Added card/inspection flags (flag count)', added);
    report.list('Removed card/inspection flags (flag count)', removed);
    report.list('Changed flag decisions by card/inspection', changed);
    report.list('Flag evidence-only changes by card/inspection', evidence);
}

function profileCounts(profile) {
    if (!profile) return 'absent';
    return `counts ${stableJson(profile.counts)}, totals ${stableJson(profile.totals)}`;
}

function diffProfiles(before, after, report) {
    const profiles = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
    const counts = [];
    const examples = [];
    for (const id of profiles) {
        const from = before[id];
        const to = after[id];
        const oldCounts = profileCounts(from);
        const newCounts = profileCounts(to);
        if (oldCounts !== newCounts) {
            counts.push(`${id}: ${oldCounts} -> ${newCounts}`);
            continue;
        }
        if (!isDeepStrictEqual(from, to)) examples.push(id);
    }
    report.list('Pie profile count or total changes', counts);
    report.list('Pie profile evidence-only changes', examples);
}

function compareTiers(before, after, report) {
    const inspections = [...new Set([...Object.keys(before), ...Object.keys(after)])];
    const changes = [];
    for (const id of inspections.sort()) {
        if (isDeepStrictEqual(before[id], after[id])) continue;
        const from = stableJson(before[id]) ?? 'absent';
        const to = stableJson(after[id]) ?? 'absent';
        changes.push(`${id}: ${from} -> ${to}`);
    }
    report.list('Generated canon tier changes', changes);
}

export default function comparePie(before, after, corpus, report) {
    diffFlags(before.pieFlags, after.pieFlags, corpus, report);
    diffProfiles(before.pieProfiles, after.pieProfiles, report);
    compareTiers(before.canonTiers, after.canonTiers, report);
    if (isDeepStrictEqual(before.pieSummary, after.pieSummary)) return;
    report.line(`Pie policy summary: ${stableJson(before.pieSummary)}`
        + ` -> ${stableJson(after.pieSummary)}`);
}
