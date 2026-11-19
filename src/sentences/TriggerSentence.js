import Sentence from './Sentence.js';
import { parseTriggerEvent } from '../triggers/index.js';
import splitTrigger from '../triggers/splitTrigger.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

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
        this.event = parseTriggerEvent(eventText);
        this.triggerSubject = this.parseNext(this.event.subject, PHRASE_PARSERS);
        this.triggerObject = this.parseTriggerObject();
        this.readClauses(body);
    }

    parseTriggerObject() {
        const phrase = this.event.objectPhrase;
        return phrase ? this.parseNext(phrase, PHRASE_PARSERS) : null;
    }

    get referenceSeeds() {
        return [this.triggerSubject, this.triggerObject].filter(Boolean);
    }

    childContext(context) {
        return { ...super.childContext(context), delayedTrigger: this };
    }
}
