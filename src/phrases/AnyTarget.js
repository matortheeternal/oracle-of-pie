import Phrase from './Phrase.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const N = NUMBER_PATTERN;
const COUNTED = `(?:up to (${N})|${N} or (${N})|any number of|(${N}))`;
const ANY_TARGET = new RegExp(
    `^(?:any (?:other |one )?target\\b|${COUNTED} (?:other )?targets\\b)`, 'i'
);

export default class AnyTarget extends Phrase {
    static match(scribe, str) {
        return str.match(ANY_TARGET);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const count = match.slice(1).find(Boolean);
        this.count = count ? numberValue(count) : 1;
    }

    get isAnyTarget() {
        return true;
    }

    hasType(type) {
        return ['creature', 'player', 'planeswalker', 'battle'].includes(type);
    }
}
