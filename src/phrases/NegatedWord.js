import { TYPE_WORDS } from './vocabulary.js';
import { classifyWord, TYPE, SUBTYPE, QUALIFIER } from './wordClass.js';

const NEGATION = /^non-?/i;
const PLURAL_S = /(?<=[^s])s$/;

function normalized(word) {
    return word.toLowerCase().replace(PLURAL_S, '');
}

const CANONICAL_WORDS = {
    [TYPE]: word => TYPE_WORDS[word.toLowerCase()],
    [SUBTYPE]: normalized,
    [QUALIFIER]: word => word.toLowerCase()
};

export default class NegatedWord {
    constructor(scribe, word) {
        const inner = word.replace(NEGATION, '');
        this.wordClass = classifyWord(scribe, inner) ?? QUALIFIER;
        this.word = CANONICAL_WORDS[this.wordClass](inner);
    }

    excludes(wordClass, word) {
        if (this.wordClass !== wordClass) return false;
        return this.word === CANONICAL_WORDS[wordClass](word);
    }
}
