import { COLORS } from '../../src/index.js';
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

function citationComparison(flag) {
    const differences = flag.offending.map(color => {
        const observed = flag.tiers[color].tier;
        const effective = flag.effectiveTiers[color].tier;
        const name = COLOR_NAMES[color];
        return `${name}: ${observed} by frequency, ${effective} with citation`;
    });
    return { label: flag.citation.source, text: differences.join(' · ') };
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

function occurrenceEvidence(flag) {
    const text = { label: 'Matched text', text: flag.evidence, code: true };
    if (flag.effectiveTiers)
        return [text, citationComparison(flag), ...exceptionEvidence(flag)];
    return [
        text,
        { label: 'Judged as', text: judgementOf(flag) },
        ...tierEvidence(flag),
        ...exceptionEvidence(flag),
        ...citationEvidence(flag)
    ];
}

function profileEvidence(flag, profile, offending) {
    const counts = { label: 'Printed monocolor matches', text: canonCounts(profile) };
    if (flag.effectiveTiers) return [counts];
    return [
        { ...counts, label: 'Printed mono cards with this effect' },
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
            ...flags.flatMap(occurrenceEvidence),
            ...profileEvidence(flag, profile, offending),
            { label: 'Verdict', text: VERDICT_HINT }
        ]
    };
}
