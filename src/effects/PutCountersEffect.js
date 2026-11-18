import Effect from './Effect.js';
import Amount from '../values/Amount.js';
import PhraseList from '../phrases/PhraseList.js';

const PUT_COUNTERS_ALTERNATIVES = [
    '(?:\\w+ )?(?:[+\\-−]\\d+\\/[+\\-−]\\d+|[a-z]+) counters? on ',
    '(?:a|an|\\w+) [^,.]*counters? on each'
];
const PUT_COUNTERS = new RegExp(
    `^puts? (?=${PUT_COUNTERS_ALTERNATIVES.join('|')})`, 'i'
);
const COUNTER_KIND = /^([+\-−]\d+\/[+\-−]\d+|[a-z]+(?: [a-z]+)?) counters? on /i;
const EACH_OF = /^each of /i;
const MINUS_TOUGHNESS = /\/-\d/;
const PLUS_ONE = '+1/+1';

export default class PutCountersEffect extends Effect {
    static get pattern() {
        return PUT_COUNTERS;
    }

    parseArguments(match) {
        this.amount = this.consume([Amount]);
        this.kind = this.consumeText(COUNTER_KIND)?.[1].replace('−', '-') ?? null;
        this.consumeText(EACH_OF);
        this.objects = this.consume([PhraseList]);
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
        return this.kind === PLUS_ONE;
    }

    get isMinusCounters() {
        return MINUS_TOUGHNESS.test(this.kind ?? '');
    }
}
