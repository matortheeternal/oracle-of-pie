import ObjectCost from './ObjectCost.js';

const SACRIFICE = /^sacrifice /i;

export default class SacrificeCost extends ObjectCost {
    static get pattern() {
        return SACRIFICE;
    }

    get sacrificesOther() {
        return this.phrases.some(phrase => !phrase.refersToSelf);
    }
}
