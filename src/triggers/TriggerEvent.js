import Parser from '../core/Parser.js';
import UnrecognizedText from '../values/UnrecognizedText.js';
import { PHRASE_PARSERS } from '../phrases/index.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import SelfOrAnother from './subjects/SelfOrAnother.js';
import SelfOrAttached from './subjects/SelfOrAttached.js';
import StateCondition from './conditions/StateCondition.js';
import { STATE_CONDITIONS } from './conditions/index.js';
import EffectSubjectGroup from '../phrases/EffectSubjectGroup.js';

const SELF = /^(?:~|this (?:[a-z]+|~))$/i;
const YOU = /^you$/i;

export default class TriggerEvent extends Parser {
    static get pattern() {
        return null;
    }

    static get subjectParsers() {
        return [SelfOrAnother, SelfOrAttached, ...PHRASE_PARSERS];
    }

    static get qualifierParsers() {
        return [];
    }

    static get conditionParsers() {
        return STATE_CONDITIONS;
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
        const qualifiers = [...this.qualifierParsers, ...this.conditionParsers];
        event.qualifiers = event.consumeAll(qualifiers, []);
        event.claimSpan(str);
        return event;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.subject = match.groups?.subject?.trim() ?? '';
        this.qualifiers = [];
        this.unreadSubject = null;
        this.unreadObject = null;
        this.unreadText = null;
    }

    parseParticipants() {
        this.subjectPhrase = this.parseSubject();
        this.unreadSubject = this.unreadSubjectText();
        this.objectPhrase = this.parseObjectPhrase();
        this.unreadObject = this.unreadParticipant(this.objectPhrase, this.objectSource);
    }

    parseSubject() {
        const phrase = this.parseNext(this.subject, this.constructor.subjectParsers);
        if (!phrase?.remainingStr) return phrase;
        const group = this.parseNext(this.subject, [EffectSubjectGroup]);
        return group?.isGroup && !group.remainingStr ? group : phrase;
    }

    unreadSubjectText() {
        const phrase = this.subjectPhrase;
        const leftover = phrase ? phrase.remainingStr : this.subject;
        return UnrecognizedText.fromLeftover(this.scribe, leftover);
    }

    unreadParticipant(phrase, source) {
        if (phrase || !source) return null;
        return UnrecognizedText.fromLeftover(this.scribe, source);
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
        this.unreadSubject = null;
        this.sharesSubject = true;
        this.claimSpan(predicate);
    }

    get children() {
        const subject = [this.subjectPhrase, this.unreadSubject];
        const participants = [...subject, ...this.objectParticipants, ...this.qualifiers];
        return [...participants, this.unreadText].filter(Boolean);
    }

    get objectParticipants() {
        return [this.objectPhrase, this.unreadObject];
    }

    get turnWindow() {
        return this.qualifierOfKind(TurnWindow);
    }

    get condition() {
        return this.qualifierOfKind(StateCondition);
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

    get isReflexive() {
        return false;
    }

    get isRepeatable() {
        return true;
    }

    get objectText() {
        return null;
    }

    get objectSource() {
        return this.objectText;
    }
}
