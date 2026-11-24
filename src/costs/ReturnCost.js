import ObjectCost from './ObjectCost.js';

const RETURN = /^return /i;
const TO_HAND = /^to (?:its|their) owners?'s? hands?/i;

export default class ReturnCost extends ObjectCost {
    static get pattern() {
        return RETURN;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.returnsToHand = Boolean(this.consumeText(TO_HAND));
    }
}
