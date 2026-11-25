import Parser from '../../core/Parser.js';

const COMPARISON = /^equal to that (creature|permanent)'s (power|toughness)\b/i;

export default class DamageComparison extends Parser {
    static match(scribe, str) {
        return str.match(COMPARISON);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.recipientType = match[1].toLowerCase();
        this.stat = match[2].toLowerCase();
    }
}
