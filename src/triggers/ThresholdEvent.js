import TriggerEvent from './TriggerEvent.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const COUNT = NUMBER_PATTERN + '|[\\d,]+';
const COUNTERS = new RegExp(
    '^(?:there are) (?<amount>' + COUNT + ') or more (?<kind>[a-z]+) counters on ', 'i'
);
const CONTROL = /^(?<subject>you) (?:don't control|control no) /i;
const STAT = new RegExp(
    '^(?:its|this creature\'s) (?<stat>power|toughness) becomes'
        + ' (?<value>\\d+) this way', 'i'
);
const SEPARATORS = /,/g;

export default class ThresholdEvent extends TriggerEvent {
    static match(scribe, str) {
        return str.match(COUNTERS) ?? str.match(CONTROL) ?? str.match(STAT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { amount, kind, value, stat, subject } = match.groups;
        this.minimumCounters = amount
            ? numberValue(amount.replace(SEPARATORS, '')) : null;
        this.counterKind = kind?.toLowerCase() ?? null;
        this.stat = stat?.toLowerCase() ?? null;
        this.value = value ? Number(value) : null;
        this.isNegatedControl = Boolean(subject);
    }

    parseObjectPhrase() {
        return this.consume(PHRASE_PARSERS);
    }

    get isRepeatable() {
        return false;
    }
}
