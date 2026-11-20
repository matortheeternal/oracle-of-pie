import Phrase from '../../phrases/Phrase.js';
import SelfReference from '../../phrases/SelfReference.js';
import NounPhrase from '../../phrases/NounPhrase.js';

const OR_ANOTHER = /^ or (?=another\b)/i;
const OR = /^or /i;

export default class SelfOrAnother extends Phrase {
    static get connector() {
        return OR_ANOTHER;
    }

    static get otherParsers() {
        return [NounPhrase];
    }

    static match(scribe, str) {
        const self = SelfReference.match(scribe, str);
        if (!self || !this.connector.test(str.slice(self[0].length))) return null;
        return self;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.self = this.readBranch(SelfReference.parse(scribe, match, str));
        this.remainingStr = this.self.remainingStr;
        this.consumeText(OR);
        this.other = this.readBranch(this.consume(this.constructor.otherParsers));
    }

    readBranch(phrase) {
        phrase?.joinUnion(this);
        return phrase;
    }

    get children() {
        return [this.self, this.other].filter(Boolean);
    }

    get isRecognized() {
        return Boolean(this.other?.isRecognized) && this.self.isRecognized;
    }

    get refersToSelf() {
        return true;
    }

    get controlledByYou() {
        return Boolean(this.other?.controlledByYou);
    }

    get controlledByOpponent() {
        return false;
    }

    get hasSubtypes() {
        return Boolean(this.other?.hasSubtypes);
    }

    hasType(type) {
        return Boolean(this.other?.hasType(type));
    }

    allowsTypeAlone(type) {
        return Boolean(this.other?.allowsTypeAlone(type));
    }

    hasExactType(type) {
        return Boolean(this.other?.hasExactType(type));
    }

    hasSubtype(subtype) {
        return Boolean(this.other?.hasSubtype(subtype));
    }

    hasQualifier(qualifier) {
        return Boolean(this.other?.hasQualifier(qualifier));
    }
}
