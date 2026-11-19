import BodyAbility from './BodyAbility.js';
import { TRIGGER_EVENTS } from '../triggers/index.js';
import splitTrigger from '../triggers/splitTrigger.js';

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
        this.event = this.parseNext(match[2], TRIGGER_EVENTS);
    }

    get parts() {
        return [this.event, ...super.parts];
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
