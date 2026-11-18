import ObjectCost from './ObjectCost.js';

const SACRIFICE = /^sacrifice /i;

export default class SacrificeCost extends ObjectCost {
    static get pattern() {
        return SACRIFICE;
    }
}
