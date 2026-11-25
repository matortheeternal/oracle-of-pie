import Parser from '../core/Parser.js';
import { normalizeCounterKind } from '../effects/counterKinds.js';
import Amount from './Amount.js';
import { NUMBER_PATTERN } from './numberWords.js';

const COUNT = '(?<count>(?:up to |at least )?(?:twice |half )?'
    + '(?:that many(?: plus one)?|a number of|another|' + NUMBER_PATTERN + '))';
const KIND = '(?:[+\\-−]\\d+/[+\\-−]\\d+|[a-z]+(?: [a-z]+)?)';
const SUFFIX = ' counters?(?: of that kind)?\\b';
const CHOICE = '(?:your choice of )?';
const MULTIPLE_KINDS = new RegExp(
    '^' + CHOICE + COUNT + ' (?<choices>' + KIND
        + '(?:(?:,? (?:or|and) |, )' + KIND + ')+)'
        + SUFFIX, 'i'
);
const QUANTITY = new RegExp(
    '^' + COUNT + ' (?:additional )?(?<kind>' + KIND + ')' + SUFFIX, 'i'
);
const REFERENCED_KIND = /^(?:another|an? additional|an?) counter of that kind\b/i;
const EXISTING = /^(?:its|their|those) counters\b/i;
const UNSPECIFIED = new RegExp(
    `^(?<kind>${KIND})${SUFFIX}(?= on | equal to )`, 'i'
);
const COPIED_KIND = new RegExp(
    '^(?<count>twice that many|that many plus one|one|the same number) '
        + 'of each (?:kind of counter|of those kinds of counters)\\b', 'i'
);
const POSSESSIVE = new RegExp('^(?:its|their|those) (?<kind>' + KIND + ')' + SUFFIX, 'i');
const CHOICE_BOUNDARY = /,? (?:and|or) |, /i;

export default class CounterQuantity extends Parser {
    static match(scribe, str) {
        return str.match(MULTIPLE_KINDS) ?? str.match(QUANTITY)
            ?? str.match(REFERENCED_KIND) ?? str.match(EXISTING)
            ?? str.match(COPIED_KIND) ?? str.match(POSSESSIVE) ?? str.match(UNSPECIFIED);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { count, kind, choices } = match.groups ?? {};
        this.amount = count ? this.parseNext(count, [Amount]) : null;
        const kinds = choices?.split(CHOICE_BOUNDARY) ?? [kind].filter(Boolean);
        this.kinds = kinds.map(name => normalizeCounterKind(name.toLowerCase()));
        this.movesExistingCounters = EXISTING.test(match[0]);
    }

    get children() {
        return [this.amount].filter(Boolean);
    }
}
