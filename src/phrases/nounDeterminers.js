import { NUMBER_PATTERN } from '../values/numberWords.js';

const N = NUMBER_PATTERN;
const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'];
const ORDINAL = `(?:${ORDINALS.join('|')})`;
const ORDINAL_WORD = new RegExp(`\\b${ORDINAL}$`);
const DETERMINER_ALTERNATIVES = [
    `${N}, ${N},? or (${N})(?: (?:other )?target)?`,
    `${N} or (${N}) (?:other )?target`,
    `up to (${N}) (?:other )?target`,
    'any number of (?:other )?target',
    'each of any number of',
    `(${N}) (?:other )?target`,
    `up to (${N})`,
    'up to that many (?:other )?target', 'up to that many',
    `exactly (${N})`,
    `each of (${N}) target`,
    `each of (${N})`,
    'that many target',
    'that many', 'a number of', 'all the', 'a random', 'a different',
    'half the', 'a tenth of the',
    `at least (${N})`,
    `(?:a|the) ${ORDINAL} target`,
    'up to twice X target',
    'another target', 'other target', 'target', 'each other', 'each',
    'all other',
    'all', 'another', 'one or more', `(${N}) or more`,
    'any number of those', 'any number of', 'any', N,
    `the ${ORDINAL}`, 'the next', 'your next', 'the', 'that', 'those',
    'your(?= (?:commanders?|Ring-bearer)\\b)'
];
export const DETERMINER = new RegExp(`^(${DETERMINER_ALTERNATIVES.join('|')})\\b`, 'i');

export function ordinalOf(determiner) {
    const word = determiner?.match(ORDINAL_WORD)?.[0];
    return word ? ORDINALS.indexOf(word) + 1 : null;
}
