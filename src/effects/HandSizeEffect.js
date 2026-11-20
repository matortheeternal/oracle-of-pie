import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const HAND_SIZE = new RegExp(
    '^(?:ha(?:ve|s) no maximum hand size\\b'
        + `|your maximum hand size is (${NUMBER_PATTERN})(?=$|\\.(?: |$)))`,
    'i'
);
const DEFAULT_MAXIMUM = 7;

export default class HandSizeEffect extends Effect {
    static get pattern() {
        return HAND_SIZE;
    }

    parseArguments(match) {
        this.maximum = match[1] ? numberValue(match[1]) : null;
    }

    get removesMaximum() {
        return this.maximum === null;
    }

    get increasesMaximum() {
        return this.removesMaximum || this.maximum > DEFAULT_MAXIMUM;
    }
}
