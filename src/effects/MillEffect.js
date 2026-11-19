import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const MILL_COUNT_ALTERNATIVES = [
    NUMBER_PATTERN, 'that many', 'half their library', 'cards equal to [^,.]+'
];
const MILL_COUNT = `(${MILL_COUNT_ALTERNATIVES.join('|')})`;
const MILL = new RegExp(`^mills? (?:${MILL_COUNT} ?(?:cards?)?|a card)`, 'i');

export default class MillEffect extends Effect {
    get isPlayerAction() {
        return true;
    }

    static get pattern() {
        return MILL;
    }
}
