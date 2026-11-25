import Parser from '../../core/Parser.js';
import NounPhrase from '../../phrases/NounPhrase.js';

const INTO_SELF = /^into ~(?=$|[ ,.])/i;
const INTO_TYPE = /^into (?=an? )/i;

export default class TransformedFace extends Parser {
    static match(scribe, str) {
        return str.match(INTO_SELF) ?? str.match(INTO_TYPE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.refersToSelf = INTO_SELF.test(match[0]);
        this.characteristics = this.refersToSelf ? null : this.consume([NounPhrase]);
    }

    get children() {
        return [this.characteristics].filter(Boolean);
    }

    get isRecognized() {
        return this.refersToSelf || Boolean(this.characteristics?.isRecognized);
    }
}
