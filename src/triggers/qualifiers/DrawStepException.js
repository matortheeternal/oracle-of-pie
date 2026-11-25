import Parser from '../../core/Parser.js';
import { NUMBER_PATTERN, numberValue } from '../../values/numberWords.js';

const FIRST_DRAWS = new RegExp(
    '^except the first (' + NUMBER_PATTERN + ') they draw in each of their draw steps\\b',
    'i'
);

export default class DrawStepException extends Parser {
    static match(scribe, str) {
        return str.match(FIRST_DRAWS);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.firstDrawsExcluded = numberValue(match[1]);
    }
}
