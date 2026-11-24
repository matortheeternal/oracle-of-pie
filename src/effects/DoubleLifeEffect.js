import Effect from './Effect.js';

const DOUBLE_LIFE = /^double (your|target player's|each player's) life total/i;

export default class DoubleLifeEffect extends Effect {
    static get pattern() {
        return DOUBLE_LIFE;
    }

    parseArguments(match) {
        this.lifeTotalOwner = match[1].toLowerCase();
    }

    get doublesYourLife() {
        return this.lifeTotalOwner === 'your';
    }
}
