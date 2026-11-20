import Parser from '../../core/Parser.js';

const UNBLOCKED = /^and (?:isn't|aren't) blocked\b/i;

export default class Unblocked extends Parser {
    static match(scribe, str) {
        return str.match(UNBLOCKED);
    }
}
