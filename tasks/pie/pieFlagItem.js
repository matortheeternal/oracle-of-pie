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
    const withoutCitation = Object.entries(flag.tiers).map(tierReason).join(' · ');
    const withCitation = Object.entries(flag.effectiveTiers).map(tierReason).join(' · ');
    return [
        { label: 'Without the citation allowance', text: withoutCitation },
        { label: 'Current policy', text: withCitation },
        {
            label: 'Why this is here',
            text: 'The citation allowance suppresses this flag.'
        }
    ];
}

function judgementEvidence(flag) {
    if (flag.effectiveTiers) return citationComparison(flag);
    return [{ label: 'Judged as', text: judgementOf(flag) }, ...tierEvidence(flag)];
}

function questionFor(flags, offending) {
    const [flag] = flags;
    if (flag.effectiveTiers) {
        const colors = offending.map(color => COLOR_NAMES[color]).join(' or ');
        return `Does “${flag.title}” bend or break the color pie in ${colors}?`;
    }
    if (flags.length > 1) return `Are these color pie flags for “${flag.title}” correct?`;
    const colors = offending.join('');
    return `Is “${flag.title}” a color pie ${severityWord(flag)} in ${colors}?`;
}

function occurrenceEvidence(flag) {
    return [
        { label: 'Matched text', text: flag.evidence, code: true },
        ...judgementEvidence(flag),
        ...exceptionEvidence(flag),
        ...citationEvidence(flag)
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
            { label: 'Printed mono cards with this effect', text: canonCounts(profile) },
            { label: 'Printed examples', text: printedExamples(profile, offending) },
            { label: 'Verdict', text: VERDICT_HINT }
        ]
    };
}
