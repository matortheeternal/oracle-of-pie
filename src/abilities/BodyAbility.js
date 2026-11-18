import Ability from './Ability.js';

function consumesSourceAlways(sentence) {
    if (sentence.statement?.isConditional) return false;
    return sentence.effects.some(effect => effect.consumesSource);
}

export default class BodyAbility extends Ability {
    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.body = this.parseBody(this.bodyText(match));
        this.remainingStr = '';
    }

    bodyText(match) {
        return match[match.length - 1];
    }

    get parts() {
        return [this.body];
    }

    get consumesSource() {
        return this.limitsToOnce || this.body.sentences.some(consumesSourceAlways);
    }

    get limitsUses() {
        return this.body.sentences.some(sentence => sentence.statement?.limitsUses);
    }

    get limitsToOnce() {
        return this.body.sentences.some(sentence => sentence.statement?.limitsToOnce);
    }

    get hasAdditionalCost() {
        return this.body.sentences.some(sentence => sentence.statement?.isAdditionalCost);
    }
}
