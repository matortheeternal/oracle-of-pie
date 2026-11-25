import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const LIFE_EQUAL_TO = 'life equal to [^,.]+?(?= rather than|$|[,.])';
const PAY_LIFE = new RegExp(
    '^pays? (?:(' + NUMBER_PATTERN + '|twice X|that much|twice that much|half your) life'
        + '|(any amount of) life|' + LIFE_EQUAL_TO + ')', 'i'
);
const AGAIN = /^again\b/i;
const ALTERNATIVE = /^rather than pay(?:ing)? [^,.]+/i;

export default class PayLifeEffect extends Effect {
    get isPlayerAction() {
        return true;
    }

    static get pattern() {
        return PAY_LIFE;
    }

    parseArguments(match) {
        this.amountText = match[1] ?? match[2] ?? null;
        this.repeatsPriorPayment = Boolean(this.consumeText(AGAIN));
        this.isAlternativeCost = Boolean(this.consumeText(ALTERNATIVE));
    }
}
