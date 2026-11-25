import Effect from './Effect.js';

const VALUE = '(?:\\d+|X)/(?:\\d+|X)';
const CHOSEN = '(?:that|the chosen) base power and toughness';
const FORMULA = 'each equal to [^,.]+?(?= until\\b|$|[,.])';
const FIXED_STAT = 'base (?<stat>power|toughness) (?<value>\\d+)';
const BASE_PT = `(?:base power and toughness (?<pt>${VALUE})|${CHOSEN}`
    + `|${FIXED_STAT}|base power and toughness (?<formula>${FORMULA}))`;
const SET_BASE_PT = new RegExp(`^(?:has|have|gains?) ${BASE_PT}`, 'i');

export default class SetBasePTEffect extends Effect {
    static get pattern() {
        return SET_BASE_PT;
    }

    parseArguments(match) {
        this.powerToughness = match.groups.pt ?? null;
        const { stat, value } = match.groups;
        this.basePower = stat?.toLowerCase() === 'power' ? Number(value) : null;
        this.baseToughness = stat?.toLowerCase() === 'toughness' ? Number(value) : null;
        this.formula = match.groups.formula ?? null;
    }

    get isChosenValue() {
        return this.powerToughness === null && this.basePower === null
            && this.baseToughness === null
            && this.formula === null;
    }
}
