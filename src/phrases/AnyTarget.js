import Phrase from './Phrase.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const N = NUMBER_PATTERN;
const COUNTED = '(?:'
    + `up to (${N})|${N}, ${N},? or (${N})|${N} or (${N})|any number of|(${N})`
    + ')';
const ANY_TARGET = new RegExp(
    `^(?:any (?:other |one )?target\\b|${COUNTED} (?:other )?targets\\b)`, 'i'
);
const EXCLUDED_SUBTYPE = /^that (?:isn't|is not) an? (?<subtype>[A-Z][a-z-]+)\b/;
const EXCLUDED_COMMANDER = /^that (?:isn't|is not) a commander\b/i;
const EXCLUDED_PERMANENT = /^other than that (?<type>permanent|creature|planeswalker)\b/i;

export default class AnyTarget extends Phrase {
    static match(scribe, str) {
        return str.match(ANY_TARGET);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const count = match.slice(1).find(Boolean);
        this.count = count ? numberValue(count) : 1;
        this.excludesCommander = Boolean(this.consumeText(EXCLUDED_COMMANDER));
        this.excludedSubtype = this.consumeText(EXCLUDED_SUBTYPE)?.groups.subtype ?? null;
        this.excludedObject = this.consumeText(EXCLUDED_PERMANENT)?.groups.type ?? null;
    }

    get isAnyTarget() {
        return true;
    }

    excludesSubtype(subtype) {
        return this.excludedSubtype === subtype;
    }

    hasType(type) {
        return ['creature', 'player', 'planeswalker', 'battle'].includes(type);
    }
}
