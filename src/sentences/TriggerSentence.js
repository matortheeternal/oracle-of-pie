import Sentence from './Sentence.js';
import { TRIGGER_EVENTS } from '../triggers/index.js';
import splitTrigger from '../triggers/splitTrigger.js';

const TRIGGER_WORD = /^(when|whenever) (?!you do\b)/i;

export default class TriggerSentence extends Sentence {
    static matchStatement(scribe, text) {
        const word = text.match(TRIGGER_WORD);
        if (!word) return null;
        const split = splitTrigger(scribe, text.slice(word[0].length));
        return split ? [word[0], word[1], ...split] : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const [, word, eventText, body] = match.statement;
        this.trigger = `${word} ${eventText}`;
        this.event = this.parseNext(eventText, TRIGGER_EVENTS);
        this.readClauses(body);
    }

    get children() {
        return [this.event, ...super.children];
    }

    childContext(context) {
        return { ...super.childContext(context), delayedTrigger: this };
    }
}
