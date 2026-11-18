import Effect from './Effect.js';
import Amount from '../values/Amount.js';

const DRAW = /^draws? /i;
const CARDS = /^(?:additional )?cards?\b(?: for each [^,.]+)?/i;
const CARDS_EQUAL = /^cards equal to [^,.]+/i;

export default class DrawEffect extends Effect {
    static get pattern() {
        return DRAW;
    }

    parseArguments(match) {
        this.amount = this.consume([Amount]);
        this.cards = this.consumeText(CARDS) ?? this.consumeText(CARDS_EQUAL);
    }

    get parts() {
        return [this.amount].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.cards);
    }
}
