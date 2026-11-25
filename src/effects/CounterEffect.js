import ObjectEffect from './ObjectEffect.js';

const COUNTERED = '(?=target|up to|that|the\\b|it\\b|all|each|another|\\w+ target)';
const COUNTER = new RegExp(`^counters? ${COUNTERED}`, 'i');
const ABILITY_SOURCE = /^of an? [^,.]+/i;
const UNLESS = /^unless ([^.]+)/i;
const PAYMENT = /\bpays?\b/i;
const NONMANA = /^that isn't a mana ability\b/i;

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
        this.consumeText(ABILITY_SOURCE);
        this.excludesManaAbilities = Boolean(this.consumeText(NONMANA));
        this.unless = this.consumeText(UNLESS)?.[1] ?? null;
    }

    get countersSpell() {
        return this.phrases.some(isCounterable);
    }

    get offersPayment() {
        return PAYMENT.test(this.unless ?? '');
    }
}
