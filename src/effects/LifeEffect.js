import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const LIFE_AMOUNT_ALTERNATIVES = [
    `(?:${NUMBER_PATTERN}|that much) life(?: for each [^,.]+)?`,
    'life equal to [^,.]+',
    'half their life, rounded (?:up|down)'
];
export const LIFE_AMOUNT = `(?:${LIFE_AMOUNT_ALTERNATIVES.join('|')})`;

export default class LifeEffect extends Effect {
    get isPlayerAction() {
        return true;
    }

    parseArguments(match) {
        this.amountText = match[1];
    }
}
