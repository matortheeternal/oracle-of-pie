import Effect from './Effect.js';
import { normalizeCounterKind, isPlusOneKind, lowersToughness } from './counterKinds.js';
import Amount from '../values/Amount.js';
import PhraseList from '../phrases/PhraseList.js';

const PUT_COUNTERS_ALTERNATIVES = [
    '(?:\\w+ )?(?:[+\\-−]\\d+\\/[+\\-−]\\d+|[a-z]+) counters? on ',
    '(?:a|an|\\w+) [^,.]*counters? on each',
    '(?:that many|a number of) [^,.]*?counters? (?:on|equal to) '
];
const PUT_COUNTERS = new RegExp(
    `^puts? (?=${PUT_COUNTERS_ALTERNATIVES.join('|')})`, 'i'
);
const KIND_NAME = '([+\\-−]\\d+/[+\\-−]\\d+|[a-z]+(?: [a-z]+)?)';
const COUNTER_KIND = new RegExp(`^${KIND_NAME} counters? (?:equal to [^,.]+? )?on `, 'i');
const EQUAL_TO = /^equal to [^,.]+/i;
const EACH_OF = /^each of /i;

export default class PutCountersEffect extends Effect {
    static get pattern() {
        return PUT_COUNTERS;
    }

    parseArguments(match) {
        this.amount = this.consume([Amount]);
        this.kind = normalizeCounterKind(this.consumeText(this.kindPattern)?.[1]);
        this.consumeText(EACH_OF);
        this.objects = this.consume([PhraseList]);
        this.consumeText(EQUAL_TO);
    }

    get kindPattern() {
        return COUNTER_KIND;
    }

    get parts() {
        return [this.amount, this.objects].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.kind && this.objects);
    }

    get phrases() {
        return this.objects?.phrases ?? [];
    }

    get isPlusCounters() {
        return isPlusOneKind(this.kind);
    }

    get isMinusCounters() {
        return lowersToughness(this.kind);
    }
}
