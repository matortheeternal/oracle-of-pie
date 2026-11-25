import Sentence from './Sentence.js';
import splitTrigger from '../triggers/splitTrigger.js';

const TRIGGER_WORD = /^(when|whenever|at) (?!(?:you|they) do\b)/i;

export default class TriggerSentence extends Sentence {
    static matchStatement(scribe, text) {
        const word = text.match(TRIGGER_WORD);
        if (!word) return null;
        const split = splitTrigger(scribe, text.slice(word[0].length));
        if (!split) return null;
        if (word[1].toLowerCase() === 'at' && !split[1].isRecognized) return null;
        return [word[0], word[1], ...split];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const [, word, eventText, event, body] = match.statement;
        this.trigger = `${word} ${eventText}`;
        this.event = event;
        this.readClauses(body);
    }

    get children() {
        return [this.event, ...super.children];
    }

    get acceptsNestedStatement() {
        return true;
    }

    get events() {
        return this.event.alternatives;
    }

    childContext(context) {
        return { ...super.childContext(context), delayedTrigger: this };
    }
}
