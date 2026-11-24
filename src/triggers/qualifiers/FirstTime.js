import Parser from '../../core/Parser.js';

const FIRST_TIME = /^for the first time\b/i;

export default class FirstTime extends Parser {
    static match(scribe, str) {
        return str.match(FIRST_TIME);
    }
}
