import Parser from '../../core/Parser.js';

const INTO_SELF = /^into ~(?=$|[ ,.])/i;

export default class TransformedFace extends Parser {
    static match(scribe, str) {
        return str.match(INTO_SELF);
    }
}
