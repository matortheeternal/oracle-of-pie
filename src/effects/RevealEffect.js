import ObjectEffect from './ObjectEffect.js';

const REVEAL = /^reveals? (?!(?:their|your|his or her) hand)/i;
const PASSIVE_REVEAL = /^those (?<values>choices|numbers|votes) are revealed\b/i;
const AS_DRAWN = /^you draw each turn as you draw it\b/i;
const QUANTITY = /^equal to (?<amount>[^,.]+?)(?=,|$)/i;

export default class RevealEffect extends ObjectEffect {
    static get pattern() {
        return REVEAL;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(PASSIVE_REVEAL);
    }

    parseArguments(match) {
        this.revealedValues = match.groups?.values.toLowerCase() ?? null;
        if (this.revealedValues) return;
        super.parseArguments(match);
        this.asDrawn = Boolean(this.consumeText(AS_DRAWN));
        this.quantity = this.consumeText(QUANTITY)?.groups.amount ?? null;
    }

    get isComplete() {
        return Boolean(this.revealedValues) || super.isComplete;
    }
}
