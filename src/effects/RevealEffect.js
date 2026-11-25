import ObjectEffect from './ObjectEffect.js';

const REVEAL = /^reveals? (?!(?:their|your|his or her) hand)/i;
const AS_DRAWN = /^you draw each turn as you draw it\b/i;
const QUANTITY = /^equal to (?<amount>[^,.]+?)(?=,|$)/i;

export default class RevealEffect extends ObjectEffect {
    static get pattern() {
        return REVEAL;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.asDrawn = Boolean(this.consumeText(AS_DRAWN));
        this.quantity = this.consumeText(QUANTITY)?.groups.amount ?? null;
    }
}
