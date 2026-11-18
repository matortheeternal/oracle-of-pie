import ObjectCost from './ObjectCost.js';

const EXILE = /^exile /i;

export default class ExileCost extends ObjectCost {
    static get pattern() {
        return EXILE;
    }
}
