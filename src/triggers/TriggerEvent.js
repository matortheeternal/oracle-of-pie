import Parser from '../core/Parser.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const SELF = /^(?:~|this (?:[a-z]+|~))$/i;
const YOU = /^you$/i;

export default class TriggerEvent extends Parser {
    static get pattern() {
        return null;
    }

    static match(scribe, str) {
        return str.match(this.pattern);
    }

    static parse(scribe, match, str) {
        const event = super.parse(scribe, match, str);
        event.parseParticipants();
        return event;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.text = str;
        this.subject = match.groups?.subject?.trim() ?? '';
        this.remainingStr = '';
    }

    parseParticipants() {
        this.subjectPhrase = this.parseNext(this.subject, PHRASE_PARSERS);
        this.objectPhrase = this.parseObjectPhrase();
    }

    parseObjectPhrase() {
        const text = this.objectText;
        return text ? this.parseNext(text, PHRASE_PARSERS) : null;
    }

    get children() {
        return [this.subjectPhrase, this.objectPhrase].filter(Boolean);
    }

    get isSelf() {
        return SELF.test(this.subject);
    }

    get isYou() {
        return YOU.test(this.subject);
    }

    get isRepeatable() {
        return true;
    }

    get objectText() {
        return null;
    }
}
