import Sentence from './Sentence.js';

const SCRY_ACTION = /^scry\b/i;
const GAIN_LIFE_ACTION = /^gain life\b/i;
const REPLACEMENT = /^if ([^,]+?) would ([^,]+), (?=.+\binstead\b)/i;

export default class ReplacementSentence extends Sentence {
    static matchStatement(scribe, text) {
        return text.match(REPLACEMENT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const [, subject, action] = match.statement;
        this.replacesScry = SCRY_ACTION.test(action);
        this.replacesLifeGain = GAIN_LIFE_ACTION.test(action);
        this.event = `${subject} would ${action}`;
        this.readClauses(match.rest);
    }
}
