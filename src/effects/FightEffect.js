import ObjectEffect from './ObjectEffect.js';

const FIGHT = /^fights? (?:(?<reciprocal>each other)\b)?/i;

export default class FightEffect extends ObjectEffect {
    static get pattern() {
        return FIGHT;
    }

    parseArguments(match) {
        this.isReciprocal = Boolean(match.groups.reciprocal);
        if (!this.isReciprocal) super.parseArguments(match);
    }

    get isComplete() {
        return this.isReciprocal || super.isComplete;
    }
}
