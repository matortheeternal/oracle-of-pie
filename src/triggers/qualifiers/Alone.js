import Parser from '../../core/Parser.js';

const ALONE = /^alone\b/i;

export default class Alone extends Parser {
    static match(scribe, str) {
        return str.match(ALONE);
    }
}
