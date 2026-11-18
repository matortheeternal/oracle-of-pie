import ObjectEffect from './ObjectEffect.js';

const COUNTER = /^counters? (?=target|up to|that|it\b|all|each|another|\w+ target)/i;
const UNLESS = /^unless ([^.]+)/i;

function isCounterable(phrase) {
    if (phrase.isBackReference) return true;
    return Boolean(phrase.hasExactType?.('spell') || phrase.hasExactType?.('ability'));
}

export default class CounterEffect extends ObjectEffect {
    static get pattern() {
        return COUNTER;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.unless = this.consumeText(UNLESS)?.[1] ?? null;
    }

    get countersSpell() {
        return this.phrases.some(isCounterable);
    }
}
