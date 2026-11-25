import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const HAND_SIZE = new RegExp(
    '^(?:ha(?:ve|s) no maximum hand size\\b'
        + `|(?<owner>your|each opponent's|target player's) maximum hand size is `
        + `(?:(?<number>${NUMBER_PATTERN})(?=$|\\.(?: |$))|equal to (?<formula>[^,.]+)))`,
    'i'
);
const DEFAULT_MAXIMUM = 7;
const REDUCTION = new RegExp(
    '^(?<owner>your|their) maximum hand size is reduced by '
        + `(?<reduction>${NUMBER_PATTERN})\\b`,
    'i'
);

export default class HandSizeEffect extends Effect {
    static get pattern() {
        return HAND_SIZE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(REDUCTION);
    }

    parseArguments(match) {
        const { number, owner, formula, reduction } = match.groups;
        this.maximum = number ? numberValue(number) : null;
        this.owner = owner?.toLowerCase() ?? null;
        this.formula = formula ?? null;
        this.reduction = reduction ? numberValue(reduction) : 0;
    }

    get removesMaximum() {
        return this.maximum === null && this.formula === null && !this.reduction;
    }

    get increasesMaximum() {
        return this.removesMaximum || this.maximum > DEFAULT_MAXIMUM;
    }
}
