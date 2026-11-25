import Parser from '../../core/Parser.js';
import { NUMBER_PATTERN, numberValue } from '../../values/numberWords.js';

const PAYMENT = new RegExp(
    `^by spending (?<amount>${NUMBER_PATTERN}) or more mana to activate it\\b`, 'i'
);

export default class ActivationPayment extends Parser {
    static match(scribe, str) {
        return str.match(PAYMENT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.minimumMana = numberValue(match.groups.amount);
    }
}
