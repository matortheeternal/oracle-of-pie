import BodyAbility from './BodyAbility.js';
import { parseTriggerEvent } from '../triggers/index.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const TRIGGER_WORD = /^(when|whenever|at) /i;
const COMMA = ', ';

function splitTrigger(scribe, rest) {
    let index = rest.indexOf(COMMA);
    while (index >= 0) {
        const body = rest.slice(index + COMMA.length);
        if (scribe.startsClause(body)) return [rest.slice(0, index), body];
        index = rest.indexOf(COMMA, index + 1);
    }
    return null;
}

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
    }

    get referenceSeeds() {
        return [this.triggerSubject].filter(Boolean);
    }

    get isRepeatable() {
        return this.event.isRepeatable;
    }

    get hasInterveningIf() {
        return Boolean(this.body.sentences[0]?.statement?.isInterveningIf);
    }
}
