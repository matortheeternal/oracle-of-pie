import ObjectEffect from './ObjectEffect.js';

const REVEAL = /^reveals? (?!(?:their|your|his or her) hand)/i;
const PASSIVE_REVEAL = /^(?:those|the) (?<values>choices|numbers|votes) are revealed\b/i;
const REVEAL_CHOICES = new RegExp(
    '^reveals? those numbers (?<simultaneous>simultaneously) and determine the highest '
        + 'and lowest numbers revealed this way\\b', 'i'
);
const REVEAL_NUMBER = /^reveals? (?<values>the number (?:you|they) chose)\b/i;
const AS_DRAWN = /^you draw each turn as you draw it\b/i;
const QUANTITY = /^equal to (?<amount>[^,.]+?)(?=,|$)/i;
const FROM_DECK = /^from your deck\b/i;

export default class RevealEffect extends ObjectEffect {
    static get pattern() {
        return REVEAL;
    }

    static match(scribe, str) {
        return str.match(REVEAL_CHOICES) ?? str.match(REVEAL_NUMBER)
            ?? super.match(scribe, str) ?? str.match(PASSIVE_REVEAL);
    }

    parseArguments(match) {
        this.determinesRange = Boolean(match.groups?.simultaneous);
        this.revealedValues = match.groups?.values?.toLowerCase()
            ?? (this.determinesRange ? 'numbers' : null);
        if (this.revealedValues) return;
        super.parseArguments(match);
        this.revealsFromDeck = Boolean(this.consumeText(FROM_DECK));
        this.asDrawn = Boolean(this.consumeText(AS_DRAWN));
        this.quantity = this.consumeText(QUANTITY)?.groups.amount ?? null;
    }

    get isComplete() {
        return Boolean(this.revealedValues) || super.isComplete;
    }
}
