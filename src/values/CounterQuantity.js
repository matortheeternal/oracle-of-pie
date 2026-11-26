import Parser from '../core/Parser.js';
import { normalizeCounterKind } from '../effects/counterKinds.js';
import Amount from './Amount.js';
import SelfReference from '../phrases/SelfReference.js';
import { NUMBER_PATTERN } from './numberWords.js';

const COUNT = '(?<count>(?:up to |at least )?(?:twice |half )?'
    + '(?:that many(?: plus one)?|that number of|a number of|another|'
    + NUMBER_PATTERN + '))';
const KIND = '(?:[+\\-−]\\d+/[+\\-−]\\d+|[a-z]+(?: [a-z]+)?)';
const SUFFIX = ' counters?(?: of that kind)?\\b';
const CHOICE = '(?:your choice of )?';
const MULTIPLE_KINDS = new RegExp(
    '^' + CHOICE + COUNT + ' (?<choices>' + KIND
        + '(?:(?:,? (?:or|and) |, )' + KIND + ')+)'
        + SUFFIX, 'i'
);
const QUANTITY = new RegExp(
    '^' + CHOICE + COUNT + ' (?:additional )?(?<kind>' + KIND + ')' + SUFFIX, 'i'
);
const REFERENCED_KIND = /^(?:another|an? additional|an?) counter of that kind\b/i;
const EXISTING = /^(?:its|their|those) counters\b/i;
const SOURCE_COUNTERS = new RegExp(
    '^(?<source>~|this (?:creature|permanent|artifact))\'s counters\\b', 'i'
);
const UNSPECIFIED = new RegExp(
    `^(?<kind>${KIND})${SUFFIX}(?= on | equal to )`, 'i'
);
const COPIED_KIND = new RegExp(
    '^(?<count>(?:half|twice) that many|that many plus one|one|the same number) '
        + 'of each (?:kind of counter|of those kinds of counters)\\b', 'i'
);
const COPY_COUNT_AND_KIND = /^(?<count>the same number) and kind of counters\b/i;
const POSSESSIVE = new RegExp('^(?:its|their|those) (?<kind>' + KIND + ')' + SUFFIX, 'i');
const CHOICE_BOUNDARY = /,? (?:and|or) |, /i;
const KIND_LIST = `${KIND}(?:, ${KIND})*(?:,? (?:and|or) ${KIND})`;
const CHOSEN_KIND = new RegExp(
    `^your choice of (?<count>${NUMBER_PATTERN}) counter from among `
        + `(?<choices>${KIND_LIST})(?= on )`,
    'i'
);
const EXISTING_KIND_CHOICE = new RegExp(
    '^your choice of (?<count>an?) (?<kind>' + KIND + ') counter or '
        + 'a counter of (?<existing>that kind)\\b', 'i'
);
const COUNTER_FORMS = [
    CHOSEN_KIND, EXISTING_KIND_CHOICE, MULTIPLE_KINDS, QUANTITY, REFERENCED_KIND,
    EXISTING, SOURCE_COUNTERS, COPIED_KIND, COPY_COUNT_AND_KIND, POSSESSIVE, UNSPECIFIED
];

export default class CounterQuantity extends Parser {
    static match(scribe, str) {
        for (const form of COUNTER_FORMS) {
            const match = str.match(form);
            if (match) return match;
        }
        return null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { count, kind, choices, existing, source } = match.groups ?? {};
        this.amount = count ? this.parseNext(count, [Amount]) : null;
        const kinds = choices?.split(CHOICE_BOUNDARY) ?? [kind].filter(Boolean);
        this.kinds = kinds.map(name => normalizeCounterKind(name.toLowerCase()));
        this.source = source ? this.parseNext(source, [SelfReference]) : null;
        this.movesExistingCounters = Boolean(this.source) || EXISTING.test(match[0]);
        this.mayMatchExistingKind = Boolean(existing);
    }

    get children() {
        return [this.amount, this.source].filter(Boolean);
    }
}
