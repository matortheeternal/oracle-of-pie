import Parser from '../../core/Parser.js';

const WITHOUT_DYING = /^without dying\b/i;

export default class WithoutDying extends Parser {
    static match(scribe, str) {
        return str.match(WITHOUT_DYING);
    }
}
