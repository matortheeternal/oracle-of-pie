import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const HAND_SIZE = new RegExp(
    '^(?:ha(?:ve|s) no maximum hand size\\b'
        + `|(?<owner>your|each opponent's|target player's) maximum hand size is `
        + `(?:(?<number>${NUMBER_PATTERN})(?=$|\\.(?: |$))|equal to (?<formula>[^,.]+)))`,
    'i'
);
const DEFAULT_MAXIMUM = 7;

export default class HandSizeEffect extends Effect {
    static get pattern() {
        return HAND_SIZE;
    }

    parseArguments(match) {
        const { number, owner, formula } = match.groups;
        this.maximum = number ? numberValue(number) : null;
        this.owner = owner?.toLowerCase() ?? null;
        this.formula = formula ?? null;
    }

    get removesMaximum() {
        return this.maximum === null && this.formula === null;
    }

    get increasesMaximum() {
        return this.removesMaximum || this.maximum > DEFAULT_MAXIMUM;
    }
}
