import BodyAbility from './BodyAbility.js';
import { parseTriggerEvent } from '../triggers/index.js';
import splitTrigger from '../triggers/splitTrigger.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const TRIGGER_WORD = /^(when|whenever|at) /i;

export default class TriggeredAbility extends BodyAbility {
    static match(scribe, str) {
        const word = str.match(TRIGGER_WORD);
        if (!word) return null;
        const split = splitTrigger(scribe, str.slice(word[0].length));
        return split ? [str, word[1], ...split] : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.trigger = `${match[1]} ${match[2]}`;
        this.event = parseTriggerEvent(match[2]);
        this.triggerSubject = this.parseNext(this.event.subject, PHRASE_PARSERS);
        this.triggerObject = this.parseTriggerObject();
    }

    parseTriggerObject() {
        const phrase = this.event.objectPhrase;
        return phrase ? this.parseNext(phrase, PHRASE_PARSERS) : null;
    }

    get referenceSeeds() {
        return [this.triggerSubject, this.triggerObject].filter(Boolean);
    }

    get isRepeatable() {
        return this.event.isRepeatable && !this.consumesSource;
    }

    get hasInterveningIf() {
        return Boolean(this.body.sentences[0]?.isInterveningIf);
    }

    get interveningCondition() {
        return this.hasInterveningIf ? this.body.sentences[0] : null;
    }

    childContext(context) {
        const childContext = super.childContext(context);
        const condition = this.interveningCondition;
        return condition ? { ...childContext, condition } : childContext;
    }
}
