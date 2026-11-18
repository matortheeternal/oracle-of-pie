import Effect from './Effect.js';

const BASE_PT = 'base power and toughness ((?:\\d+|X)/(?:\\d+|X))';
const SET_BASE_PT = new RegExp(`^(?:has|have|gains?) ${BASE_PT}`, 'i');

export default class SetBasePTEffect extends Effect {
    static get pattern() {
        return SET_BASE_PT;
    }

    parseArguments(match) {
        this.powerToughness = match[1];
    }
}
