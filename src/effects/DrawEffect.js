import Effect from './Effect.js';
import Amount from '../values/Amount.js';

const DRAW = /^draws? /i;
const BURST_COUNT = 3;
const FOR_EACH = /\bfor each\b/i;
const CARDS = /^(?:additional )?cards?\b(?: for each [^,.]+)?/i;
const CARDS_EQUAL = /^cards equal to [^,.]+/i;

export default class DrawEffect extends Effect {
    static get pattern() {
        return DRAW;
    }

    parseArguments(match) {
        this.amount = this.consume([Amount]);
        this.cards = this.consumeText(CARDS_EQUAL) ?? this.consumeText(CARDS);
    }

    get parts() {
        return [this.amount].filter(Boolean);
    }

    get count() {
        if (FOR_EACH.test(this.cards ?? '')) return null;
        return typeof this.amount?.value === 'number' ? this.amount.value : null;
    }

    get isSingleCard() {
        return this.count === 1;
    }

    get isVariable() {
        if (!this.isComplete || this.amount?.isPrevious) return false;
        return this.count === null;
    }

    get isBurst() {
        return this.isVariable || this.count >= BURST_COUNT;
    }

    get isComplete() {
        return Boolean(this.cards);
    }
}
