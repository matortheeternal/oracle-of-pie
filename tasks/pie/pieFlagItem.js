import { COLORS } from '../../../rules-scribe/src/index.js';

const SEVERITY_WORDS = { 'warning': 'break', 'weak-warning': 'bend' };
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

function judgement(flag, word, colors) {
    return `${flag.colors} ${flag.policy}, ${word} in ${colors}`;
}

function exceptionEvidence(flag) {
    return flag.exception ? [{ label: 'Exception applied', text: flag.exception }] : [];
}

export default function pieFlagItem({ id, card, flag, profile }) {
    const word = SEVERITY_WORDS[flag.severity];
    const colors = flag.offending.join('');
    return {
        id: `${id}|${flag.inspection}`,
        question: `Is “${flag.title}” a color pie ${word} in ${colors}?`,
        tag: flag.inspection,
        card,
        evidence: [
            { label: 'Matched text', text: flag.evidence, code: true },
            { label: 'Judged as', text: judgement(flag, word, colors) },
            ...exceptionEvidence(flag),
            { label: 'Printed mono cards with this effect', text: canonCounts(profile) },
            { label: 'Printed examples', text: printedExamples(profile, flag.offending) },
            { label: 'Verdict', text: VERDICT_HINT }
        ]
    };
}
