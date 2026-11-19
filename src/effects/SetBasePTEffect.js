import Effect from './Effect.js';

const VALUE = '(?:\\d+|X)/(?:\\d+|X)';
const CHOSEN = '(?:that|the chosen) base power and toughness';
const BASE_PT = `(?:base power and toughness (${VALUE})|${CHOSEN})`;
const SET_BASE_PT = new RegExp(`^(?:has|have|gains?) ${BASE_PT}`, 'i');

export default class SetBasePTEffect extends Effect {
    static get pattern() {
        return SET_BASE_PT;
    }

    parseArguments(match) {
        this.powerToughness = match[1] ?? null;
    }

    get isChosenValue() {
        return this.powerToughness === null;
    }
}
