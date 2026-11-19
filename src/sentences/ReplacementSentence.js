import Sentence from './Sentence.js';

const REPLACEMENT = /^if ([^,]+?) would ([^,]+), (?=.+\binstead\b)/i;

export default class ReplacementSentence extends Sentence {
    static matchStatement(scribe, text) {
        return text.match(REPLACEMENT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const [, subject, action] = match.statement;
        this.event = `${subject} would ${action}`;
        this.readClauses(match.rest);
    }
}
