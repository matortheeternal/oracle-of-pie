import Parser from '../../core/Parser.js';

const THIS_WAY = /^this way\b/i;

export default class ThisWay extends Parser {
    static match(scribe, str) {
        return str.match(THIS_WAY);
    }
}
