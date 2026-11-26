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

function occurrenceEvidence(flag) {
    return [
        { label: 'Matched text', text: flag.evidence, code: true },
        { label: 'Judged as', text: judgementOf(flag) },
        ...tierEvidence(flag),
        ...exceptionEvidence(flag),
        ...citationEvidence(flag)
    ];
}

export default function pieFlagItem({ id, card, flags, profile }) {
    const [flag] = flags;
    const word = severityWord(flag);
    const offending = [...new Set(flags.flatMap(occurrence => occurrence.offending))];
    const colors = offending.join('');
    return {
        id: `${id}|${flag.inspection}`,
        question: flags.length === 1
            ? `Is “${flag.title}” a color pie ${word} in ${colors}?`
            : `Are these color pie flags for “${flag.title}” correct?`,
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
