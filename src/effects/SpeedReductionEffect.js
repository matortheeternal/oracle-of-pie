import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const LOWER = new RegExp(
    `^reduce (?<owner>that opponent's|that player's|their) speed by `
        + `(?<amount>${NUMBER_PATTERN})\\b`, 'i'
);
const FLOOR = new RegExp(
    `^this effect can't reduce (?<owner>their) speed below `
        + `(?<floor>${NUMBER_PATTERN})\\b`,
    'i'
);

export default class SpeedReductionEffect extends Effect {
    static get pattern() {
        return LOWER;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(FLOOR);
    }

    parseArguments(match) {
        const { owner, amount, floor } = match.groups;
        this.owner = owner.toLowerCase();
        this.reducesBy = amount ? numberValue(amount) : null;
        this.floor = floor ? numberValue(floor) : null;
    }
}
