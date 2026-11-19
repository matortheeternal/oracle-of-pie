import Parser from '../core/Parser.js';
import UnrecognizedText from '../values/UnrecognizedText.js';
import { PHRASE_PARSERS } from '../phrases/index.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const SELF = /^(?:~|this (?:[a-z]+|~))$/i;
const YOU = /^you$/i;

export default class TriggerEvent extends Parser {
    static get pattern() {
        return null;
    }

    static get qualifierParsers() {
        return [];
    }

    static match(scribe, str) {
        return str.match(this.pattern);
    }

    static parse(scribe, match, str) {
        const event = this.read(scribe, match, str);
        event.consumeUnreadText();
        return event;
    }

    static read(scribe, match, str) {
        const event = super.parse(scribe, match, str);
        event.parseParticipants();
        event.qualifiers = event.consumeAll(this.qualifierParsers, []);
        event.claimSpan(str);
        return event;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.subject = match.groups?.subject?.trim() ?? '';
        this.qualifiers = [];
        this.unreadText = null;
    }

    parseParticipants() {
        this.subjectPhrase = this.parseNext(this.subject, PHRASE_PARSERS);
        this.objectPhrase = this.parseObjectPhrase();
    }

    parseObjectPhrase() {
        const text = this.objectText;
        return text ? this.parseNext(text, PHRASE_PARSERS) : null;
    }

    consumeUnreadText() {
        this.unreadText = this.consume([UnrecognizedText]);
    }

    shareSubject(predicate) {
        this.subjectPhrase = null;
        this.sharesSubject = true;
        this.claimSpan(predicate);
    }

    get children() {
        const participants = [this.subjectPhrase, this.objectPhrase, ...this.qualifiers];
        return [...participants, this.unreadText].filter(Boolean);
    }

    get turnWindow() {
        return this.qualifierOfKind(TurnWindow);
    }

    qualifierOfKind(kind) {
        return this.qualifiers.find(qualifier => qualifier instanceof kind) ?? null;
    }

    get alternatives() {
        return [this];
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
