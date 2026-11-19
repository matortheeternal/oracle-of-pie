import Parser from '../core/Parser.js';
import UnrecognizedText from '../values/UnrecognizedText.js';
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
        event.unreadText = event.consume([UnrecognizedText]);
        return event;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.subject = match.groups?.subject?.trim() ?? '';
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
        return [this.subjectPhrase, this.objectPhrase, this.unreadText].filter(Boolean);
    }

    get isUnsupported() {
        return false;
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
