import keywordInspection from './keywordInspection.js';
import ColorTiers from '../ColorTiers.js';
import KEYWORD_CANON from '../keywordCanon.json' with { type: 'json' };
import { CANON_KEYWORDS } from './keywords.js';

const RETURNING = 'Returning';
const SET_MECHANICS = 'Set mechanics';
const RETURNING_MIN_SETS = 3;
const KEYWORD_CANON_SOURCE = 'canon';
const EVERGREEN = new Set(CANON_KEYWORDS);

function subgroupOf({ sets }) {
    return sets >= RETURNING_MIN_SETS ? RETURNING : SET_MECHANICS;
}

function printedKeywordInspection([keyword, canon]) {
    return keywordInspection(keyword, {
        tiers: ColorTiers.fromNames(canon.tiers, KEYWORD_CANON_SOURCE),
        subgroup: subgroupOf(canon),
        canonCount: canon.canonCards
    });
}

export const PRINTED_KEYWORD_INSPECTIONS = Object.entries(KEYWORD_CANON)
    .filter(([keyword]) => !EVERGREEN.has(keyword))
    .map(printedKeywordInspection);
