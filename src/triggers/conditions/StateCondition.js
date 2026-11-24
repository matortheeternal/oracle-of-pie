import Parser from '../../core/Parser.js';
import { NotImplementedError } from '../../core/customErrors.js';

export default class StateCondition extends Parser {
    static get pattern() {
        throw new NotImplementedError('pattern');
    }

    static match(scribe, str) {
        return str.match(this.pattern);
    }
}
