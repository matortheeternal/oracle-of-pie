import Parser from '../core/Parser.js';
import Duration from '../values/Duration.js';
import PhraseList from '../phrases/PhraseList.js';
import { NotImplementedError } from '../core/customErrors.js';

const LEADING_SPACE = /^\s+/;
const ROUNDING = /^,? rounded (up|down)\b/i;

export default class Effect extends Parser {
    static get pattern() {
        throw new NotImplementedError('pattern');
    }

    static match(scribe, str) {
        return str.match(this.pattern);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.subject = null;
        this.isOptional = false;
        this.isAlternative = false;
        this.parseArguments(match);
        this.rounding = this.consumeText(ROUNDING)?.[1].toLowerCase() ?? null;
        this.duration = this.consumeDuration();
    }

    parseArguments(match) {
    }

    consumeDuration() {
        const start = this.remainingStr;
        this.consumeText(LEADING_SPACE);
        const duration = this.consume([Duration]);
        if (!duration) this.remainingStr = start;
        return duration;
    }

    consumeObjects() {
        return this.consume([PhraseList]);
    }

    get parts() {
        return [];
    }

    get isComplete() {
        return true;
    }

    get children() {
        return [this.subject, ...this.parts, this.duration].filter(Boolean);
    }

    get isRecognized() {
        return this.isComplete && super.isRecognized;
    }

    get isOpaque() {
        return false;
    }

    get consumesSource() {
        return false;
    }

    childContext(context) {
        return { ...context, effectDuration: this.duration, parentEffect: this };
    }

    get isExile() {
        return false;
    }

    get removesPermanently() {
        return false;
    }

    get returnsToBattlefield() {
        return false;
    }

    get isPlayerAction() {
        return false;
    }

    acceptsSubject(subject) {
        return !this.isPlayerAction || Boolean(subject.isPlayer);
    }

    shareSubject(subject) {
        this.subject = subject;
        this.sharedSubject = subject;
    }

    get sharesSubject() {
        return Boolean(this.sharedSubject);
    }

    get actingSubject() {
        return this.subject ?? this.inheritedSubject ?? null;
    }

    get subjectIsOpponent() {
        const subject = this.actingSubject;
        return Boolean(subject?.isPlayer && subject.canBeOpponent);
    }

    get cardsGained() {
        return 0;
    }

    get affectsYou() {
        const subject = this.actingSubject;
        return !subject || Boolean(subject.includesYou);
    }

    get canAffectYou() {
        return !this.subject || Boolean(this.subject.canBeYou);
    }

    get subjectIsYou() {
        const subject = this.actingSubject;
        return !subject || Boolean(subject.isPlayer && subject.isYou);
    }
}
