import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const MILL_COUNT_ALTERNATIVES = [
    'twice (?:X|that many)', 'that many', 'half (?:their|your) library',
    'cards equal to [^,.]+', NUMBER_PATTERN
];
const MILL_COUNT = `(${MILL_COUNT_ALTERNATIVES.join('|')})`;
const MILL = new RegExp(`^mills? (?:${MILL_COUNT} ?(?:cards?)?|a card)\\b`, 'i');

export default class MillEffect extends Effect {
    parseArguments(match) {
        this.amountText = match[1].toLowerCase();
    }

    get isPlayerAction() {
        return true;
    }

    static get pattern() {
        return MILL;
    }
}
