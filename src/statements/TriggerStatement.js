import Statement from './Statement.js';
import { parseTriggerEvent } from '../triggers/index.js';
import splitTrigger from '../triggers/splitTrigger.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const TRIGGER_WORD = /^(when|whenever) (?!you do\b)/i;

export default class TriggerStatement extends Statement {
    static match(scribe, str) {
        const word = str.match(TRIGGER_WORD);
        if (!word) return null;
        const split = splitTrigger(scribe, str.slice(word[0].length));
        return split ? [word[0], word[1], ...split] : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.trigger = `${match[1]} ${match[2]}`;
        this.event = parseTriggerEvent(match[2]);
        this.triggerSubject = this.parseNext(this.event.subject, PHRASE_PARSERS);
        this.remainingStr = match[3];
        this.clauses = this.consumeClauses();
    }

    get referenceSeeds() {
        return [this.triggerSubject].filter(Boolean);
    }

    get children() {
        return [this.clauses].filter(Boolean);
    }

    childContext(context) {
        return { ...context, delayedTrigger: this };
    }
}
