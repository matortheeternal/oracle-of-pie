import Parser from '../../core/Parser.js';

const WHILE_SADDLED = /^while saddled\b/i;

export default class WhileSaddled extends Parser {
    static match(scribe, str) {
        return str.match(WHILE_SADDLED);
    }
}
