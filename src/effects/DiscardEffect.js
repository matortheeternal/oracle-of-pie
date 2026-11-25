import Effect from './Effect.js';
import Amount from '../values/Amount.js';

const DISCARD = /^discards? /i;
const WHOLE_HAND = /^(?:all (?:the )?cards (?:in|from) )?(?:their|your) hand$/i;
const DISCARDED_ALTERNATIVES = [
    'all (?:the )?cards (?:in|from) (?:their|your) hand',
    '(?:[a-z]+ )?cards?(?: at random| of their choice| with [^,.]+)?',
    '(?:their|your) hand',
    'that card',
    'it',
    'cards equal to [^,.]+',
    'any number of (?:creature |land |nonland |artifact )?cards',
    'a card at random'
];
const DISCARDED = new RegExp(
    `^(?:${DISCARDED_ALTERNATIVES.join('|')})`, 'i'
);
const OPEN_COUNT = /^any number of /i;

export default class DiscardEffect extends Effect {
    get isPlayerAction() {
        return true;
    }

    static get pattern() {
        return DISCARD;
    }

    parseArguments(match) {
        this.amount = this.consume([Amount]);
        this.discarded = this.consumeText(DISCARDED)?.[0] ?? null;
    }

    get parts() {
        return [this.amount].filter(Boolean);
    }

    get count() {
        if (this.discardsHand) return Infinity;
        return typeof this.amount?.value === 'number' ? this.amount.value : null;
    }

    get cardsGained() {
        return this.count === null ? null : -this.count;
    }

    get hasOpenDiscardCount() {
        return OPEN_COUNT.test(this.discarded ?? '');
    }

    get discardsHand() {
        return WHOLE_HAND.test(this.discarded ?? '');
    }

    get isComplete() {
        return Boolean(this.discarded);
    }
}
