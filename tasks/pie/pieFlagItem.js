import { COLORS } from '../../src/index.js';
import { percent } from '../shared/table.js';
import { severityWord, judgementOf } from './pieJudgement.js';

const VERDICT_HINT = 'Correct = the card really bends or breaks the color pie this way. '
    + 'Wrong = misread text, wrong colors, or the effect is fine in these colors.';

function canonCounts(profile) {
    if (!profile) return 'no canon profile';
    return COLORS.map(color => `${color} ${profile.counts[color] ?? 0}`).join(' · ');
}

function printedExamples(profile, offending) {
    const lines = offending.map(color =>
        `${color}: ${(profile?.examples[color] ?? []).join(', ') || 'none'}`);
    return lines.join('\n');
}

function exceptionEvidence(flag) {
    return flag.exception ? [{ label: 'Exception applied', text: flag.exception }] : [];
}

function citedTiers(tiers) {
    return COLORS.filter(color => tiers[color])
        .map(color => `${color} ${tiers[color]}`)
        .join(' · ');
}

function citationEvidence(flag) {
    if (!flag.citation) return [];
    const { source, line, tiers } = flag.citation;
    return [{ label: source, text: `${line}: ${citedTiers(tiers)}` }];
}

function tierReason([color, { tier, source }]) {
    return `${color} ${tier} (${source ?? 'unsourced'})`;
}

function tierEvidence(flag) {
    const reasons = Object.entries(flag.tiers).map(tierReason);
    return [{ label: 'Tiers', text: reasons.join(' · ') }];
}

const COLOR_NAMES = { W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green' };

function frequencyLine(profile, color, name) {
    const counts = profile?.counts ?? {};
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    if (!total) return '';
    const share = percent((counts[color] ?? 0) / total);
    return `${share} of matching monocolor cards printed since 2016 were ${name}.`;
}

function citationLines(flag, profile, color) {
    const observed = flag.tiers[color].tier;
    const effective = flag.effectiveTiers[color].tier;
    const name = COLOR_NAMES[color];
    const text = [
        `${flag.title} is ${observed} in ${name} based on its frequency in canon cards.`,
        `Maro’s Mechanical Color Pie (2021) lists ${flag.citation.line} as ${effective}`
            + ` in ${name}.`
    ].join('\n');
    const frequency = frequencyLine(profile, color, name);
    return { label: 'Tier comparison', text, frequency };
}

function citationComparison(flag, profile) {
    const changed = flag.offending.filter(color =>
        flag.tiers[color].tier !== flag.effectiveTiers[color].tier);
    return changed.map(color => citationLines(flag, profile, color));
}

function citationQuestion(flags) {
    const bySeverity = Map.groupBy(flags, severityWord);
    const judgements = [];
    for (const [severity, matches] of bySeverity) {
        const colors = new Set(matches.flatMap(flag => flag.offending));
        const names = [...colors].map(color => COLOR_NAMES[color]).join(' or ');
        judgements.push(`${severity} in ${names}`);
    }
    return `Is “${flags[0].title}” a color pie ${judgements.join(' or ')}?`;
}

function questionFor(flags, offending) {
    const [flag] = flags;
    if (flag.effectiveTiers) return citationQuestion(flags);
    if (flags.length > 1) return `Are these color pie flags for “${flag.title}” correct?`;
    const colors = offending.join('');
    return `Is “${flag.title}” a color pie ${severityWord(flag)} in ${colors}?`;
}

function occurrenceEvidence(flag, profile) {
    const text = { label: 'Matched text', text: flag.evidence, code: true };
    if (flag.effectiveTiers)
        return [text, ...citationComparison(flag, profile), ...exceptionEvidence(flag)];
    return [
        text,
        { label: 'Judged as', text: judgementOf(flag) },
        ...tierEvidence(flag),
        ...exceptionEvidence(flag),
        ...citationEvidence(flag)
    ];
}

function profileEvidence(flag, profile, offending) {
    if (flag.effectiveTiers) return [];
    return [
        { label: 'Printed mono cards with this effect', text: canonCounts(profile) },
        { label: 'Printed examples', text: printedExamples(profile, offending) }
    ];
}

export default function pieFlagItem({ id, card, flags, profile }) {
    const [flag] = flags;
    const offending = [...new Set(flags.flatMap(occurrence => occurrence.offending))];
    return {
        id: `${id}|${flag.inspection}`,
        question: questionFor(flags, offending),
        tag: flag.inspection,
        card,
        evidence: [
            ...flags.flatMap(flag => occurrenceEvidence(flag, profile)),
            ...profileEvidence(flag, profile, offending),
            { label: 'Verdict', text: VERDICT_HINT }
        ]
    };
}
