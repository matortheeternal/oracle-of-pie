import {
    TYPE_WORDS, QUALIFIER_WORDS, NEGATED_QUALIFIER, SUBTYPE_WORD
} from './vocabulary.js';

export const TYPE = 'type';
export const SUBTYPE = 'subtype';
export const QUALIFIER = 'qualifier';
export const EXCLUSION = 'exclusion';

function isQualifier(scribe, lower) {
    return QUALIFIER_WORDS.has(lower) || scribe.definitions.isBatchWord(lower);
}

export function classifyWord(scribe, word) {
    const lower = word.toLowerCase();
    if (Object.hasOwn(TYPE_WORDS, lower)) return TYPE;
    if (isQualifier(scribe, lower)) return QUALIFIER;
    if (NEGATED_QUALIFIER.test(word)) return EXCLUSION;
    if (SUBTYPE_WORD.test(word)) return SUBTYPE;
    return null;
}
