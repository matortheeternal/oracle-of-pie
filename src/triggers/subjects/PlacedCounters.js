import Parser from '../../core/Parser.js';

const ORDINALS = {
    first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6,
    seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12
};
const QUANTITY = '(?<quantity>one or more|an?)';
const ORDINAL = `the (?<ordinal>${Object.keys(ORDINALS).join('|')})`;
const COUNTER_KIND = '(?:(?<kind>[+-]\\d+/[+-]\\d+|[a-z]+) )?';
const PLACED_COUNTERS = new RegExp(
    `^(?:${QUANTITY}|${ORDINAL}) ${COUNTER_KIND}counters?\\b`, 'i'
);

export default class PlacedCounters extends Parser {
    static match(scribe, str) {
        return str.match(PLACED_COUNTERS);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { quantity, ordinal, kind } = match.groups;
        this.quantity = quantity?.toLowerCase() ?? null;
        this.ordinal = ordinal ? ORDINALS[ordinal.toLowerCase()] : null;
        this.counterKind = kind?.toLowerCase() ?? null;
    }

    get isThreshold() {
        return this.ordinal !== null;
    }
}
