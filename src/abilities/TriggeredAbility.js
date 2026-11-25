import BodyAbility from './BodyAbility.js';
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
        this.event = match[3];
    }

    get parts() {
        return [this.event, ...super.parts];
    }

    get events() {
        return this.event.alternatives;
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
