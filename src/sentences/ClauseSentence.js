import Sentence from './Sentence.js';

const ALWAYS = /^/;

export default class ClauseSentence extends Sentence {
    static matchStatement(scribe, text) {
        return text.match(ALWAYS);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.readClauses(match.rest);
    }
}
