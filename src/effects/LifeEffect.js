import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';
import {
    scalesAmountWithManaValue, usesCreatureCount
} from '../values/quantityDependencies.js';

const LIFE_AMOUNT_ALTERNATIVES = [
    '\\d{1,3}(?:,\\d{3})+ life\\b',
    `(?:twice |half )?(?:${NUMBER_PATTERN}|that much) life`
        + '(?: for each (?:[^,.]|, (?=non))+)?',
    'life equal to [^,.]+',
    '(?:half|a third) (?:of )?(?:their|your) life(?:, rounded (?:up|down))?'
];
export const LIFE_AMOUNT = `(?:${LIFE_AMOUNT_ALTERNATIVES.join('|')})`;
const FRACTIONAL = /^(?:half|a third) (?:of )?(?:their|your) life\b/i;

export default class LifeEffect extends Effect {
    get isPlayerAction() {
        return true;
    }

    parseArguments(match) {
        this.amountText = match[1];
    }

    get usesManaValue() {
        return scalesAmountWithManaValue(this.amountText);
    }

    get usesCreatureCount() {
        return usesCreatureCount(this.amountText);
    }

    get changesFractionOfLifeTotal() {
        return FRACTIONAL.test(this.amountText);
    }
}
