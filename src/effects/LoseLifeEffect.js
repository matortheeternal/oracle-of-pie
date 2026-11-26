import LifeEffect, { LIFE_AMOUNT } from './LifeEffect.js';

const LOSE_LIFE = new RegExp(`^loses? (${LIFE_AMOUNT})`, 'i');
const SHARED_QUANTITY = /^loses? (life)(?= and discards? cards equal to )/i;

export default class LoseLifeEffect extends LifeEffect {
    static get pattern() {
        return LOSE_LIFE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(SHARED_QUANTITY);
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.sharesDiscardQuantity = SHARED_QUANTITY.test(match.input);
    }
}
